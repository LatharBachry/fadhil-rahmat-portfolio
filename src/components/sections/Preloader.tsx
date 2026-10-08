"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isExiting, setIsExiting] = useState(false);
  const [focusStrength, setFocusStrength] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 40,
    damping: 25,
    mass: 0.7,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 40,
    damping: 25,
    mass: 0.7,
  });

  const backgroundX = useTransform(
    smoothX,
    [-0.5, 0.5],
    isMobile ? [-2, 2] : [-8, 8],
  );

  const backgroundY = useTransform(
    smoothY,
    [-0.5, 0.5],
    isMobile ? [-1.5, 1.5] : [-5, 5],
  );

  const lightX = useTransform(smoothX, [-0.5, 0.5], ["18%", "82%"]);

  const lightY = useTransform(smoothY, [-0.5, 0.5], ["18%", "82%"]);

  const ambientLight = useTransform(
    [lightX, lightY],
    ([x, y]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(244,241,234,0.045), transparent 38%)`,
  );

  const nameX = useTransform(
    smoothX,
    [-0.5, 0.5],
    isMobile ? [-0.5, 0.5] : [-1.5, 1.5],
  );

  const nameY = useTransform(
    smoothY,
    [-0.5, 0.5],
    isMobile ? [-0.35, 0.35] : [-1, 1],
  );

  /*
   * =====================================================
   * MOBILE DETECTION
   * =====================================================
   */

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const updateMobileState = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateMobileState();

    mediaQuery.addEventListener("change", updateMobileState);

    return () => {
      mediaQuery.removeEventListener("change", updateMobileState);
    };
  }, []);

  /*
   * =====================================================
   * VIDEO PLAYBACK
   * =====================================================
   */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.loop = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Browser may temporarily block playback.
      }
    };

    playVideo();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        playVideo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /*
   * =====================================================
   * POINTER INTERACTION
   * =====================================================
   */

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    const container = containerRef.current;

    if (!container) return;

    /*
     * Keep mobile interaction subtle.
     * The main cinematic movement remains desktop-focused.
     */
    if (isMobile) {
      pointerX.set(0);
      pointerY.set(0);
      setFocusStrength(0);
      return;
    }

    const rect = container.getBoundingClientRect();

    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;

    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(normalizedX);
    pointerY.set(normalizedY);

    const button = buttonRef.current;

    if (!button) return;

    const buttonRect = button.getBoundingClientRect();

    const centerX = buttonRect.left + buttonRect.width / 2;

    const centerY = buttonRect.top + buttonRect.height / 2;

    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    const interactionRadius = 300;

    const strength = Math.max(0, Math.min(1, 1 - distance / interactionRadius));

    setFocusStrength(strength);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
    setFocusStrength(0);
  }

  /*
   * =====================================================
   * ENTER
   * =====================================================
   */

  function handleEnter() {
    if (isExiting) return;

    setIsExiting(true);
  }

  /*
   * =====================================================
   * EXIT CALLBACK
   * =====================================================
   */

  useEffect(() => {
    if (!isExiting) return;

    const timer = window.setTimeout(() => {
      onComplete?.();
    }, 1100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isExiting, onComplete]);

  /*
   * =====================================================
   * CONTACT LINKS
   * =====================================================
   */

  const contactItems = [
    {
      label: "WhatsApp",
      href: "https://wa.me/6285399937610",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[14px] w-[14px]"
          aria-hidden="true"
        >
          <path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3.5 20l1.2-4.1A8.5 8.5 0 1 1 20.5 11.5Z" />
          <path d="M8.2 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.5c.1.2.1.4 0 .6l-.5.6c-.1.1-.1.3 0 .5.4.7 1 1.3 1.7 1.7.2.1.4.1.5 0l.6-.5c.2-.1.4-.2.6 0l1.5.7c.2.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.4.3-.9.5-1.4.5-1.2 0-2.7-.8-3.8-1.9-1.1-1.1-1.9-2.6-1.9-3.8 0-.5.2-1 .5-1.4Z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/fadhillrahmat?stkn=Y3BiazJkam5kbDFu",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[14px] w-[14px]"
          aria-hidden="true"
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.4"
            cy="6.7"
            r="0.8"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
    },
    {
      label: "Email",
      href: "mailto:fadhilrahmatt@gmail.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[14px] w-[14px]"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.section
          ref={containerRef}
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.025,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 1.1,
            ease: [0.76, 0, 0.24, 1],
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="
            fixed
            inset-0
            z-[100]
            h-[100dvh]
            w-screen
            overflow-hidden
            bg-[var(--background)]
            text-[var(--foreground)]
          "
        >
          {/* =================================================
              BACKGROUND VIDEO
          ================================================= */}

          <motion.video
            ref={videoRef}
            src="/media/videos/entry/showreel.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="
              absolute
              left-1/2
              top-1/2
              h-full
              w-full
              -translate-x-1/2
              -translate-y-1/2
              object-cover
              object-center
            "
            style={{
              x: backgroundX,
              y: backgroundY,

              /*
               * Mobile zoom:
               * crops the source slightly so the cinematic
               * subject fills the portrait viewport better.
               */
              scale: isMobile ? 4 : 1.04,
            }}
          />

          {/* =================================================
              CINEMATIC VIDEO TREATMENT
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[var(--foreground)]/[0.018]
            "
          />

          <motion.div
            className="
              pointer-events-none
              absolute
              inset-0
            "
            style={{
              background: ambientLight,
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,rgba(244,241,234,0.025),transparent_50%)]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,transparent_40%,rgba(8,10,15,0.32)_100%)]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-[24%]
              bg-gradient-to-t
              from-[var(--background)]/[0.34]
              to-transparent
            "
          />

          {/* =================================================
              SUBTLE FILM GRAIN
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.025]
              mix-blend-overlay
            "
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
            }}
          />

          {/* =================================================
              IDENTITY
          ================================================= */}

          <motion.div
            style={{
              x: nameX,
              y: nameY,
            }}
            className="
              absolute
              left-1/2
              top-[2.25rem]
              z-20
              -translate-x-1/2
              text-center
              sm:top-9
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* NAME */}

              <span
                className="
                  block
                  whitespace-nowrap
                  text-[13px]
                  font-medium
                  uppercase
                  leading-none
                  tracking-[0.16em]
                  text-[var(--foreground)]
                  sm:text-[17px]
                  sm:tracking-[0.20em]
                "
                style={{
                  fontFamily: "var(--font-sans)",
                  textShadow: "0 2px 18px rgba(8,10,15,0.30)",
                }}
              >
                Fadhil Rahmat
              </span>

              {/* ROLE */}

              <motion.span
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-[9px]
                  block
                  text-[7px]
                  font-normal
                  uppercase
                  leading-none
                  tracking-[0.38em]
                  text-[var(--foreground)]/[0.64]
                  sm:mt-[12px]
                  sm:text-[9px]
                  sm:tracking-[0.44em]
                "
                style={{
                  fontFamily: "var(--font-sans)",
                }}
              >
                Editor
              </motion.span>

              {/* MICRO DIVIDER */}

              <motion.span
                initial={{
                  width: 0,
                  opacity: 0,
                }}
                animate={{
                  width: 20,
                  opacity: 0.3,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mx-auto
                  mt-[10px]
                  block
                  h-px
                  bg-[var(--foreground)]/[0.35]
                  sm:mt-[11px]
                "
              />
            </motion.div>
          </motion.div>

          {/* =================================================
              CENTER GLASS LENS
          ================================================= */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-30
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            {/* Ambient glass light */}

            <motion.div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
              "
              animate={{
                width:
                  (isMobile ? 175 : 210) + focusStrength * (isMobile ? 55 : 90),

                height:
                  (isMobile ? 175 : 210) + focusStrength * (isMobile ? 55 : 90),

                opacity: 0.012 + focusStrength * 0.05,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(244,241,234,0.08), transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            <motion.button
              ref={buttonRef}
              type="button"
              aria-label="Enter portfolio"
              onClick={handleEnter}
              className="
                group
                relative
                flex
                h-[116px]
                w-[116px]
                items-center
                justify-center
                rounded-full
                outline-none
                sm:h-[162px]
                sm:w-[162px]
              "
              animate={{
                y: focusStrength > 0.5 ? -4 : [0, -2, 0],

                scale: 1 + focusStrength * 0.035,
              }}
              transition={{
                y:
                  focusStrength > 0.5
                    ? {
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }
                    : {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },

                scale: {
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              whileTap={{
                scale: 0.95,
                y: 1,
              }}
            >
              {/* OUTER GLASS EDGE */}

              <motion.span
                className="
                  absolute
                  inset-0
                  rounded-full
                  border
                "
                animate={{
                  borderColor:
                    focusStrength > 0.7
                      ? "rgba(244,241,234,0.72)"
                      : "rgba(244,241,234,0.40)",

                  boxShadow:
                    focusStrength > 0.7
                      ? "0 12px 40px rgba(8,10,15,0.12), inset 0 1px 2px rgba(244,241,234,0.32)"
                      : "0 8px 30px rgba(8,10,15,0.08), inset 0 1px 2px rgba(244,241,234,0.20)",
                }}
                transition={{
                  duration: 0.4,
                }}
              />

              {/* TRANSLUCENT GLASS */}

              <motion.span
                className="
                  absolute
                  inset-[2px]
                  rounded-full
                  border
                  border-[var(--foreground)]/[0.10]
                  bg-[var(--foreground)]/[0.025]
                  backdrop-blur-[12px]
                "
                animate={{
                  backgroundColor:
                    focusStrength > 0.7
                      ? "rgba(244,241,234,0.055)"
                      : "rgba(244,241,234,0.025)",

                  borderColor:
                    focusStrength > 0.7
                      ? "rgba(244,241,234,0.20)"
                      : "rgba(244,241,234,0.11)",
                }}
                transition={{
                  duration: 0.35,
                }}
              />

              {/* INNER RING */}

              <span
                className="
                  pointer-events-none
                  absolute
                  inset-[7px]
                  rounded-full
                  border
                  border-[var(--foreground)]/[0.08]
                  sm:inset-[8px]
                "
              />

              {/* TOP REFLECTION */}

              <motion.span
                className="
                  pointer-events-none
                  absolute
                  left-[16%]
                  top-[9%]
                  h-[31%]
                  w-[60%]
                  rotate-[-18deg]
                  rounded-full
                  bg-[var(--foreground)]/[0.055]
                  blur-[9px]
                "
                animate={{
                  opacity: 0.35 + focusStrength * 0.25,
                }}
                transition={{
                  duration: 0.4,
                }}
              />

              {/* TOP EDGE LIGHT */}

              <motion.span
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-[7px]
                  h-px
                  -translate-x-1/2
                  rounded-full
                  sm:top-[8px]
                "
                animate={{
                  width: 24 + focusStrength * 30,

                  opacity: 0.16 + focusStrength * 0.24,
                }}
                transition={{
                  duration: 0.35,
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(244,241,234,0.68), transparent)",
                }}
              />

              {/* ENTER */}

              <motion.span
                className="
                  relative
                  z-10
                  font-[var(--font-display)]
                  text-[14px]
                  font-normal
                  uppercase
                  leading-none
                  tracking-[0.08em]
                  text-[var(--foreground)]
                  sm:text-[19px]
                "
                animate={{
                  letterSpacing: `${0.08 + focusStrength * 0.025}em`,

                  opacity: 0.9 + focusStrength * 0.08,

                  scale: 1 + focusStrength * 0.01,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Enter
              </motion.span>

              {/* MICRO UNDERLINE */}

              <motion.span
                className="
                  absolute
                  bottom-[27px]
                  left-1/2
                  h-px
                  -translate-x-1/2
                  sm:bottom-[34px]
                "
                animate={{
                  width: 8 + focusStrength * 18,

                  opacity: 0.1 + focusStrength * 0.2,
                }}
                transition={{
                  duration: 0.35,
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(244,241,234,0.60), transparent)",
                }}
              />

              {/* LIGHT SWEEP */}

              <span
                className="
                  pointer-events-none
                  absolute
                  inset-[7px]
                  overflow-hidden
                  rounded-full
                  sm:inset-[8px]
                "
              >
                <motion.span
                  className="
                    absolute
                    -left-[65%]
                    top-[-25%]
                    h-[150%]
                    w-[20%]
                    rotate-[22deg]
                    bg-gradient-to-r
                    from-transparent
                    via-[var(--foreground)]/[0.08]
                    to-transparent
                    blur-[6px]
                  "
                  animate={{
                    x: focusStrength > 0.75 ? "520%" : "-100%",
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </span>

              {/* CLICK RIPPLE */}

              <motion.span
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-full
                  border
                  border-[var(--foreground)]/[0.42]
                "
                initial={{
                  scale: 0.84,
                  opacity: 0,
                }}
                whileTap={{
                  scale: 1.3,
                  opacity: 0.5,
                }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                }}
              />
            </motion.button>
          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <motion.nav
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-label="Contact links"
            className="
              absolute
              bottom-0
              left-1/2
              z-20
              flex
              -translate-x-1/2
              items-center
              gap-3
              pb-[max(1.75rem,env(safe-area-inset-bottom))]
              sm:bottom-8
              sm:gap-4
              sm:pb-0
            "
          >
            {contactItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="
                  group
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[var(--foreground)]/[0.16]
                  bg-[var(--foreground)]/[0.018]
                  text-[var(--foreground)]/[0.62]
                  outline-none
                  backdrop-blur-md
                  sm:h-8
                  sm:w-8
                "
                whileHover={{
                  y: -3,
                  scale: 1.06,
                  color: "var(--foreground)",
                  borderColor: "rgba(244,241,234,0.42)",
                  backgroundColor: "rgba(244,241,234,0.045)",
                }}
                whileTap={{
                  scale: 0.94,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="relative z-10">{item.icon}</span>

                <motion.span
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    hidden
                    h-px
                    -translate-x-1/2
                    sm:block
                  "
                  initial={{
                    width: 0,
                    opacity: 0,
                  }}
                  whileHover={{
                    width: "34%",
                    opacity: 0.7,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  style={{
                    background: "var(--foreground)",
                  }}
                />

                <motion.span
                  initial={{
                    opacity: 0,
                    y: 3,
                  }}
                  whileHover={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    pointer-events-none
                    absolute
                    bottom-full
                    left-1/2
                    mb-3
                    hidden
                    -translate-x-1/2
                    whitespace-nowrap
                    rounded-sm
                    border
                    border-[var(--foreground)]/[0.10]
                    bg-[var(--background)]/[0.68]
                    px-2.5
                    py-1.5
                    font-[var(--font-sans)]
                    text-[7px]
                    font-normal
                    uppercase
                    leading-none
                    tracking-[0.2em]
                    text-[var(--foreground)]/[0.72]
                    backdrop-blur-md
                    sm:block
                  "
                >
                  {item.label}
                </motion.span>
              </motion.a>
            ))}
          </motion.nav>

          {/* =================================================
              EXIT TRANSITION
          ================================================= */}

          <AnimatePresence>
            {isExiting && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 1.02,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-[200]
                  bg-[var(--background)]
                "
              />
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
