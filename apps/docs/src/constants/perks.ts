import { Icons } from "@/components";
import { ZapIcon, ChartSplineIcon, LifeBuoyIcon, PaletteIcon, ShieldCheckIcon, WaypointsIcon, BrainCircuitIcon, SparklesIcon, Container } from "lucide-react";
import React from "react";

export const PERKS = [
    {
        icon: ZapIcon,
        title: "Fast and Efficient",
        description: "Experience quick and seamless content creation with our optimized server."
    },
    {
        icon: ChartSplineIcon,
        title: "RealTime Logs",
        description: "Gain valuable insights and logs of your build."
    },
    {
        icon: LifeBuoyIcon,
        title: "Scalable",
        description: "Our system is higly scalable for deployment using the Queues and isolated environment."
    },
    {
        icon: Container,
        title: "Isolated Environment",
        description: "Using Docker to create isolated environment for creating static builds."
    },
    {
        icon: ShieldCheckIcon,
        title: "Secure and Reliable",
        description: "We use secure FARGATE Isolated Environments to maintain security in apps."
    },
    {
        icon: WaypointsIcon,
        title: "Custom Domain",
        description: "Giving a custom name to domain map your app."
    },
];