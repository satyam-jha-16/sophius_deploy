import { cn } from "@/functions";
import Marquee from "../ui/marquee";

const reviews = [
  {
    name: "NodeJs",
    img: "/icons/node.svg",
  },
  {
    name: "ECS",
    img: "/icons/ecs.svg",
  },
  {
    name: "Docker",
    img: "/icons/docker.svg",
  },
  {
    name: "AWS",
    img: "/icons/aws.svg",
  },
  {
    name: "Svelte",
    img: "/icons/svelte.svg",
  },
  {
    name: "NextJS",
    img: "/icons/next.svg",
  },
  {
    name: "Redis",
    img: "/icons/redis.svg",
  },
  {
    name: "S3",
    img: "/icons/s3.svg",
  },
  {
    name: "TypeScript",
    img: "/icons/ts.svg",
  },
];
const rev_reviews = reviews.reverse();
const StackCard = ({ img, name }: { img: string; name: string }) => {
  return (
    <figure
      className={cn(
        "relative w-72 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full bg-white p-0.5"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

const Companies = () => {
  return (
    <div className="flex w-full py-20">
      <div className="flex flex-col items-center justify-center text-center w-full py-2">
        <h2 className="text-xl heading">Tech Stack Used</h2>
        <div className="mt-16 w-full relative overflow-hidden">
          <Marquee pauseOnHover className="[--duration:60s]">
            <div className="flex gap-8 md:gap-3">
              {reviews.map((review) => (
                <StackCard key={review.name} {...review} />
              ))}
            </div>
          </Marquee>
          <Marquee pauseOnHover reverse className="[--duration:60s]">
            <div className="flex gap-8 md:gap-3">
              {rev_reviews.map((review) => (
                <StackCard key={review.name} {...review} />
              ))}
            </div>
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
