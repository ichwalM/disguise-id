import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// Config to ensure smooth animations
gsap.config({
  nullTargetWarn: false,
});

export { gsap, ScrollTrigger, TextPlugin };
