"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

const easePremium = [0.22, 1, 0.36, 1] as const;

const easeCinematic = [0.76, 0, 0.24, 1] as const;

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  /* ==========================================================
     POINTER PARALLAX
  ========================================================== */

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 45,
    damping: 28,
    mass: 0.8,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 45,
    damping: 28,
    mass: 0.8,
  });

  const imageX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const imageY = useTransform(smoothY, [-0.5, 0.5], [-4, 4]);

  const imageScale = useTransform(smoothX, [-0.5, 0.5], [1.035, 1.045]);

  /* ==========================================================
     RESPONSIVE
  ========================================================== */

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  /* ==========================================================
     POINTER HANDLERS
  ========================================================== */

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (isMobile) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;

    const y = (event.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(x);
    pointerY.set(y);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      id="about"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="
        overflow-hidden
        bg-[#FFFFFF]
        text-[#FFFFFF]
      "
    >
      <div
        className="
          grid
          grid-cols-1
          lg:min-h-screen
          lg:grid-cols-[1fr_1fr_0.92fr]
        "
      >
        {/* =====================================================
            LEFT — PROFILE
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: -16,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.95,
            delay: 0.15,
            ease: easeCinematic,
          }}
          className="
            flex
            min-h-[700px]
            flex-col
            justify-between
            bg-[#FFFFFF]
            px-6
            py-8
            text-[#000000]
            sm:px-10
            sm:py-10
            lg:min-h-screen
            lg:px-12
            lg:py-12
            xl:px-16
            xl:py-14
          "
        >
          <div
            className="
              pt-8
              sm:pt-10
              lg:pt-[5.75rem]
            "
          >
            {/* =================================================
                IDENTITY
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
                filter: "blur(3px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.85,
                delay: 0.35,
                ease: easePremium,
              }}
            >
              <h1
                className="
                  whitespace-nowrap
                  text-[clamp(2.85rem,4.15vw,4.75rem)]
                  uppercase
                  leading-[0.91]
                  tracking-[-0.018em]
                "
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  color: "#000000",
                }}
              >
                Fadhil Rahmat
              </h1>

              <p
                className="
                  mt-3
                  text-[11px]
                  font-normal
                  uppercase
                  leading-none
                  tracking-[0.12em]
                  text-[#000000]/[0.58]
                  sm:text-[12px]
                "
                style={{
                  fontFamily: "var(--font-sans)",
                }}
              >
                Professional Editor
              </p>
            </motion.div>

            {/* =================================================
                EXPERIENCE
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.62,
                ease: easePremium,
              }}
              className="
                mt-12
                max-w-[390px]
                sm:mt-14
              "
            >
              <p
                className="
                  text-[15px]
                  font-medium
                  leading-[1.25]
                  tracking-[-0.01em]
                  text-[#000000]
                  sm:text-[16px]
                "
                style={{
                  fontFamily: "var(--font-sans)",
                }}
              >
                + 500 Videos handled
              </p>

              <p
                className="
                  mt-2
                  max-w-[360px]
                  text-[12px]
                  font-normal
                  leading-[1.65]
                  tracking-[-0.005em]
                  text-[#000000]/[0.64]
                  sm:text-[13px]
                "
                style={{
                  fontFamily: "var(--font-sans)",
                }}
              >
                for brands, musicians short films documentary and contents
              </p>
            </motion.div>

            {/* =================================================
                AWARDS
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.76,
                ease: easePremium,
              }}
              className="
                mt-9
                max-w-[430px]
                sm:mt-10
              "
            >
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[0.16em]
                  text-[#000000]/[0.72]
                  sm:text-[10px]
                "
                style={{
                  fontFamily: "var(--font-sans)",
                }}
              >
                Latest Awards
              </p>

              <div
                className="
                  mt-3
                  space-y-2
                  text-[11px]
                  font-normal
                  leading-[1.45]
                  tracking-[-0.002em]
                  text-[#000000]/[0.62]
                  sm:text-[12px]
                "
                style={{
                  fontFamily: "var(--font-sans)",
                }}
              >
                <p>Finalist Best Project - Inspiring Asia (2026)</p>

                <p>
                  Festival Film Indonesia Special Award - Film Documentary
                  (2026)
                </p>
              </div>
            </motion.div>

            {/* =================================================
                WORKFLOW
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.9,
                ease: easePremium,
              }}
              className="
                mt-9
                sm:mt-10
              "
            >
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[0.16em]
                  text-[#000000]/[0.72]
                  sm:text-[10px]
                "
                style={{
                  fontFamily: "var(--font-sans)",
                }}
              >
                My Workflow
              </p>

              <div
                className="
                  mt-3.5
                  flex
                  items-center
                  gap-2.5
                "
              >
                <ToolIcon
                  src="/media/images/hero/DaVinci_Resolve_Studio.png"
                  alt="DaVinci Resolve"
                />

                <ToolIcon
                  src="/media/images/hero/Adobe_Premiere_Pro_CC_icon.svg.webp"
                  alt="Adobe Premiere Pro"
                />

                <ToolIcon
                  src="/media/images/hero/Adobe_After_Effects_CC_icon.svg.webp"
                  alt="Adobe After Effects"
                />
              </div>
            </motion.div>
          </div>

          {/* =================================================
              MY WORK
          ================================================= */}

          <motion.a
            href="#selected-works"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 1.08,
              ease: easePremium,
            }}
            whileHover="hover"
            className="
              group
              mt-12
              flex
              w-fit
              items-center
              gap-5
              text-[9px]
              font-medium
              uppercase
              tracking-[0.20em]
              text-[#000000]/[0.64]
              lg:mt-0
            "
            style={{
              fontFamily: "var(--font-sans)",
            }}
          >
            <motion.span
              variants={{
                hover: {
                  width: 62,
                },
              }}
              transition={{
                duration: 0.35,
                ease: easePremium,
              }}
              className="
                block
                h-px
                w-12
                bg-[#000000]/[0.48]
              "
            />

            <span>My Work</span>
          </motion.a>
        </motion.div>

        {/* =====================================================
            CENTER — IMAGE
        ===================================================== */}

        <div
          className="
            relative
            aspect-[4/5]
            w-full
            overflow-hidden
            bg-[var(--background)]
            sm:aspect-[3/4]
            lg:aspect-auto
            lg:min-h-screen
          "
        >
          <motion.img
            src="/media/images/hero/fadhil-editor.png"
            alt="Fadhil Rahmat working as a video editor"
            initial={{
              opacity: 0,
              scale: 1.07,
              filter: "grayscale(1) blur(7px)",
            }}
            animate={{
              opacity: 1,
              scale: 1.04,
              filter: "grayscale(1) blur(0px)",
            }}
            transition={{
              duration: 1.45,
              delay: 0.08,
              ease: easeCinematic,
            }}
            style={{
              x: isMobile ? 0 : imageX,
              y: isMobile ? 0 : imageY,
              scale: imageScale,
            }}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
              grayscale
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[#000000]/[0.08]
            "
          />
        </div>

        {/* =====================================================
            RIGHT — CONTACT
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 16,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.95,
            delay: 0.22,
            ease: easeCinematic,
          }}
          className="
            flex
            min-h-[620px]
            flex-col
            justify-between
            bg-[var(--background)]
            px-6
            py-8
            text-[#FFFFFF]
            sm:px-10
            sm:py-10
            lg:min-h-screen
            lg:px-12
            lg:py-12
            xl:px-16
            xl:py-14
          "
        >
          <div className="pt-8 sm:pt-10 lg:pt-12">
            {/* =================================================
                CONTACT LABEL
            ================================================= */}

            <motion.p
              initial={{
                opacity: 0,
                y: 7,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                delay: 0.48,
                ease: easePremium,
              }}
              className="
                mb-8
                text-[10px]
                font-normal
                uppercase
                leading-none
                tracking-[0.20em]
                text-[#FFFFFF]/[0.70]
                sm:mb-9
                sm:text-[11px]
              "
              style={{
                fontFamily: "var(--font-sans)",
              }}
            >
              Contact
            </motion.p>

            {/* =================================================
                CONTACT DISPLAY
            ================================================= */}

            <motion.h2
              initial={{
                opacity: 0,
                y: 22,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 1,
                delay: 0.42,
                ease: easeCinematic,
              }}
              className="
                max-w-[440px]
                cursor-default
                text-[clamp(2.85rem,4.15vw,4.75rem)]
                uppercase
                leading-[0.91]
                tracking-[-0.018em]
              "
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                color: "#FFFFFF",
              }}
            >
              <span className="block">LET&apos;S</span>
              <span className="block">WORK</span>
              <span className="block">TOGETHER.</span>
            </motion.h2>

            {/* =================================================
                CONTACT DETAILS
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.88,
                ease: easePremium,
              }}
              className="
                mt-10
                space-y-6
                sm:mt-11
              "
            >
              {/* INSTAGRAM */}

              <ContactItem
                label="Instagram"
                value="@fadhillrahmat"
                href="https://www.instagram.com/fadhillrahmat?stkn=Y3BiazJkam5kbDFu"
              />

              {/* LINKEDIN */}

              <ContactItem
                label="LinkedIn"
                value="linkedin.com/in/fadhilrahmatt"
                href="https://www.linkedin.com/in/fadhilrahmatt/"
              />

              {/* WHATSAPP */}

              <ContactItem
                label="WhatsApp"
                value="0853 9993 7610"
                href="https://wa.me/6285399937610"
              />

              {/* EMAIL */}

              <ContactItem
                label="Email"
                value="fadhilrahmatt@gmail.com"
                href="mailto:fadhilrahmatt@gmail.com"
              />
            </motion.div>
          </div>

          {/* =================================================
              BOTTOM CONTACT ICONS
              DESKTOP ONLY
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.65,
              delay: 1.1,
              ease: easePremium,
            }}
            className="
              hidden
              mt-14
              items-center
              gap-3
              border-t
              border-[#FFFFFF]/[0.16]
              pt-5
              sm:flex
              lg:mt-0
              lg:pt-6
            "
          >
            {/* Instagram */}

            <SocialIcon
              href="https://www.instagram.com/fadhillrahmat?stkn=Y3BiazJkam5kbDFu"
              label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                className="h-[15px] w-[15px]"
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
            </SocialIcon>

            {/* LinkedIn */}

            <SocialIcon
              href="https://www.linkedin.com/in/fadhilrahmatt/"
              label="LinkedIn"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[15px] w-[15px]"
                aria-hidden="true"
              >
                <rect x="4" y="4" width="16" height="16" rx="1.5" />

                <path d="M8 10v6" />

                <path d="M8 8.1v.1" />

                <path d="M12 16v-3.2a2.2 2.2 0 0 1 4.4 0V16" />

                <path d="M12 10v6" />
              </svg>
            </SocialIcon>

            {/* WhatsApp */}

            <SocialIcon href="https://wa.me/6285399937610" label="WhatsApp">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[15px] w-[15px]"
                aria-hidden="true"
              >
                <path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3.5 20l1.2-4.1A8.5 8.5 0 1 1 20.5 11.5Z" />

                <path d="M8.2 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.5c.1.2.1.4 0 .6l-.5.6c-.1.1-.1.3 0 .5.4.7 1 1.3 1.7 1.7.2.1.4.1.5 0l.6-.5c.2-.1.4-.2.6 0l1.5.7c.2.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.4.3-.9.5-1.4.5-1.2 0-2.7-.8-3.8-1.9-1.1-1.1-1.9-2.6-1.9-3.8 0-.5.2-1 .5-1.4Z" />
              </svg>
            </SocialIcon>

            {/* Email */}

            <SocialIcon href="mailto:EMAIL_KAMU" label="Email">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[15px] w-[15px]"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />

                <path d="m4 7 8 6 8-6" />
              </svg>
            </SocialIcon>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================
   TOOL ICON
========================================================== */

interface ToolIconProps {
  src: string;
  alt: string;
}

function ToolIcon({ src, alt }: ToolIconProps) {
  return (
    <motion.div
      whileHover={{
        y: -3,
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.96,
      }}
      transition={{
        duration: 0.3,
        ease: easePremium,
      }}
      className="
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        overflow-hidden
        rounded-[6px]
      "
    >
      <img
        src={src}
        alt={alt}
        className="
          h-full
          w-full
          object-contain
        "
      />
    </motion.div>
  );
}

/* ==========================================================
   CONTACT ITEM
========================================================== */

interface ContactItemProps {
  label: string;
  value: string;
  href: string;
}

function ContactItem({ label, value, href }: ContactItemProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{
        x: 4,
      }}
      transition={{
        duration: 0.3,
        ease: easePremium,
      }}
      className="
        group
        block
        w-fit
      "
    >
      <span
        className="
          block
          text-[10px]
          font-normal
          uppercase
          tracking-[0.20em]
          text-[#FFFFFF]/[0.58]
          transition-colors
          duration-300
          group-hover:text-[#FFFFFF]/[0.82]
        "
        style={{
          fontFamily: "var(--font-sans)",
        }}
      >
        {label}
      </span>

      <span
        className="
          relative
          mt-1.5
          block
          w-fit
          text-[11px]
          font-normal
          tracking-[0.01em]
          text-[#FFFFFF]/[0.94]
          transition-colors
          duration-300
          group-hover:text-[#FFFFFF]
          sm:text-[12px]
        "
        style={{
          fontFamily: "var(--font-sans)",
        }}
      >
        {value}

        <span
          className="
            absolute
            bottom-[-5px]
            left-0
            h-px
            w-0
            bg-[#FFFFFF]
            transition-all
            duration-300
            ease-out
            group-hover:w-full
          "
        />
      </span>
    </motion.a>
  );
}

/* ==========================================================
   SOCIAL ICON
========================================================== */

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      whileHover={{
        y: -3,
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.94,
      }}
      transition={{
        duration: 0.25,
        ease: easePremium,
      }}
      className="
        group
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        border
        border-[#FFFFFF]/[0.18]
        text-[#FFFFFF]/[0.62]
        transition-colors
        duration-300
        hover:border-[#FFFFFF]/[0.42]
        hover:bg-[#FFFFFF]/[0.04]
        hover:text-[#FFFFFF]
      "
    >
      {children}
    </motion.a>
  );
}
