import express from "express";
import dotenv from "dotenv";
import { generateSlug } from "random-word-slugs";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { Redis } from "ioredis";
import cors from "cors";
import http from "http";
import { Server } from 'socket.io';
// import { get } from 'https'; // Replaced require with import

dotenv.config();

const PORT = 9000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
const serviceUri = process.env.REDIS_URI;
const subscriber = new Redis(serviceUri);

// Socket.IO connection handling
io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    socket.join(channel);
    socket.emit("message", `Joined ${channel}`);
  });
});

// Express middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

const ecsClient = new ECSClient({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

const config = {
  CLUSTER: process.env.CLUSTER_ARM,
  TASK: process.env.TASK_ARM,
};

app.post("/project", async (req, res) => {
  const { gitURL, slug } = req.body;
  const projectSlug = slug ? slug : generateSlug();

  const command = new RunTaskCommand({
    cluster: config.CLUSTER,
    taskDefinition: config.TASK,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          "subnet-0a52963064b99162b",
          "subnet-06b37e6427a768a36",
          "subnet-0da374856b7d7e033",
          "subnet-0913b8ea1b8468e03",
          "subnet-07743e21d4c3bc741",
          "subnet-06428d70d6973c387",
        ],
        securityGroups: [`${process.env.SECURITY_GROUP}`],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image",
          environment: [
            { name: "GIT_REPOSITORY_URL", value: gitURL },
            { name: "PROJECT_ID", value: projectSlug },
          ],
        },
      ],
    },
  });

  await ecsClient.send(command);

  return res.json({
    status: "queued",
    data: { projectSlug, url: `http://${projectSlug}.localhost:8000` },
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function initRedisSubscribe() {
  console.log("Subscribed to logs....");
  subscriber.psubscribe("logs:*");
  subscriber.on("pmessage", (pattern, channel, message) => {
    io.to(channel).emit("message", message);
  });
}

initRedisSubscribe();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setInterval(() => {
  const healthCheckUrl = `http://localhost:${PORT}/health`;
  http
    .get(healthCheckUrl, (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        console.log("Health check response:", data);
      });
    })
    .on("error", (err) => {
      console.error("Health check failed:", err.message);
    });
}, 14 * 60 * 1000); 