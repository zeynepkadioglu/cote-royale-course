"use client"

import { FC, useRef } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Bounded } from "@/components/Bounded";

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Props for `ScrollText`.
 */
export type ScrollTextProps = SliceComponentProps<Content.ScrollTextSlice>;

/**
 * Component for "ScrollText" Slices.
 */
const ScrollText: FC<ScrollTextProps> = ({ slice }) => {

  const componentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const words = asText(slice.primary.text).split(" ");

  useGSAP(
    () => {
      const component = componentRef.current;
      const textElement = textRef.current;
      const contentElement = contentRef.current;
      const letters = textElement?.querySelectorAll("span");
      if (!component || !textElement || !letters || !contentElement) return;

      gsap.set(contentElement, { filter: "blur(4px)" })
      gsap.set(letters, { color: "hsl(220, 9%, 20%)" })

      gsap.to(contentElement, {
        filter: "blur(0px)",
        duration: 1,
        scrollTrigger: {
          trigger: component,
          start: "top 75%",
          end: "top top",
          scrub: 8,
        }
      })

      const colorTl = gsap.timeline({
        scrollTrigger: {
          trigger: component,
          start: "top top",
          end: "bottom -100%",
          pin: true,
          scrub: 2,
        }
      })
      colorTl.to(letters, {
        color: "white",
        stagger: {
          each: 0.01,
          from: "start",
          ease: "power1.inOut"
        }
      })
      colorTl.to(".glow-background", {
        opacity: 1,
        ease: "power2.inOut",
        duration: 1
      },
        0
      )
    },
    { scope: componentRef })






  return (
    <Bounded
      ref={componentRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex h-screen items-center justify-center bg-neutral-950 relative"
    >
      <div className="glow-background opacity-0 absolute inset-0 z-0 h-full w-full"></div>
      <div className="absolute inset-0 bg-[url('/noisetexture.jpg')] opacity-30 mix-blend-multiply"></div>



      <div ref={contentRef}>
        <div className="mb-2 text-center text-sm tracking-wider text-neutrall-200 uppercase md:mb-8 md:text-base">{slice.primary.eyebrow}</div>
        <div ref={textRef} className="text-center">
          <p className="font-display flex flex-wrap justify-center text-5xl leading-tight text-balance uppercase md:text-7xl">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="inline">
                {word.split("").map((char, charIndex) => (
                  <span key={`${char}-${charIndex}`} className="inline">
                    {char}
                  </span>
                ))}
                {index < words.length - 1 ? (
                  <span className="inline">&nbsp;</span>
                ) : null}
              </span>
            ))}
          </p>
        </div>
      </div>

    </Bounded>
  );
};

export default ScrollText;
