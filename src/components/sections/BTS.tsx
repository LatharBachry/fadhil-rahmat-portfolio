"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

const BTS_IMAGES = [
  {
    src: "/media/images/bts/bts-01.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-02.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-03.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-04.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-05.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-06.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-07.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-08.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-09.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-10.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-11.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-12.jpg",
    alt: "Behind the scenes production",
  },
  {
    src: "/media/images/bts/bts-13.jpg",
    alt: "Behind the scenes production",
  },
];

const loopedImages = [...BTS_IMAGES, ...BTS_IMAGES];

export default function BTS() {
  const trackRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  /*
   * =========================================================
   * AUTO SCROLL
   * =========================================================
   */

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    let animationFrame: number;

    const speed = 0.3;

    const animate = () => {
      if (!isHovered && selectedIndex === null) {
        track.scrollLeft += speed;

        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHovered, selectedIndex]);

  /*
   * =========================================================
   * LIGHTBOX KEYBOARD
   * =========================================================
   */

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((selectedIndex + 1) % BTS_IMAGES.length);
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex(
          (selectedIndex - 1 + BTS_IMAGES.length) % BTS_IMAGES.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  /*
   * =========================================================
   * IMAGE ACTIONS
   * =========================================================
   */

  const openImage = (index: number) => {
    setSelectedIndex(index % BTS_IMAGES.length);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  return (
    <>
      {/* =====================================================
          BTS SECTION
      ===================================================== */}

      <section
        id="bts"
        className="
          overflow-hidden
          bg-[#00030C]
          py-20
          text-[#FFFFFF]
          md:py-24
          lg:py-28
        "
      >
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-5
            sm:px-8
            lg:px-12
          "
        >
          {/* =================================================
              SECTION LABEL
          ================================================= */}

          <p
            className="
              mb-4
              font-[var(--font-sans)]
              text-[9px]
              font-medium
              uppercase
              leading-none
              tracking-[0.20em]
              text-[#FFFFFF]/70
              sm:text-[10px]
            "
          >
            Behind The Scenes
          </p>

          {/* =================================================
              SECTION TITLE
          ================================================= */}

          <h2
            className="
              text-[#FFFFFF]
              text-[clamp(3rem,5vw,5rem)]
              font-normal
              uppercase
              leading-[0.86]
              tracking-[-0.02em]
            "
            style={{
              fontFamily: "var(--font-display)",
            }}
          >
            BEHIND
            <br />
            THE WORK.
          </h2>

          {/* =================================================
              GALLERY
          ================================================= */}

          <div
            className="
              mt-14
              -mx-5
              overflow-hidden
              px-5
              sm:mt-16
              sm:-mx-8
              sm:px-8
              lg:mt-20
              lg:-mx-12
              lg:px-12
            "
          >
            <div
              ref={trackRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="
                flex
                cursor-grab
                gap-4
                overflow-x-auto
                overscroll-x-contain
                pb-2
                active:cursor-grabbing
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                md:gap-5
              "
            >
              {loopedImages.map((image, index) => {
                const originalIndex = index % BTS_IMAGES.length;

                return (
                  <motion.button
                    key={`${image.src}-${index}`}
                    type="button"
                    aria-label={`Open BTS image ${originalIndex + 1}`}
                    onClick={() => openImage(originalIndex)}
                    className="
                      group
                      relative
                      aspect-[3/2]
                      w-[78vw]
                      shrink-0
                      cursor-pointer
                      overflow-hidden
                      bg-[#00030C]
                      text-left
                      outline-none
                      sm:w-[58vw]
                      md:w-[calc((100vw-7rem)/3)]
                      lg:w-[calc((min(1600px,100vw)-7rem)/3)]
                    "
                    whileTap={{
                      scale: 0.985,
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="
                        (max-width: 640px) 78vw,
                        (max-width: 768px) 58vw,
                        33vw
                      "
                      className="
                        object-cover
                        grayscale
                        transition-transform
                        duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:scale-[1.035]
                      "
                    />

                    {/* IMAGE OVERLAY */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-black/10
                        transition-colors
                        duration-500
                        group-hover:bg-black/0
                      "
                    />

                    {/* IMAGE NUMBER */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        bottom-4
                        left-4
                        font-[var(--font-sans)]
                        text-[9px]
                        font-medium
                        leading-none
                        tracking-[0.16em]
                        text-[#FFFFFF]
                        sm:text-[10px]
                      "
                    >
                      {String(originalIndex + 1).padStart(2, "0")}
                    </span>

                    {/* OPEN INDICATOR */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        bottom-4
                        right-4
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#FFFFFF]/25
                        bg-[#00030C]/20
                        text-[#FFFFFF]
                        opacity-0
                        backdrop-blur-sm
                        transition-all
                        duration-500
                        group-hover:opacity-100
                      "
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              SCROLL INDICATOR
          ================================================= */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-end
              gap-3
            "
          >
            <span
              className="
                h-px
                w-8
                bg-[#FFFFFF]/30
                sm:w-12
              "
            />

            <span
              className="
                font-[var(--font-sans)]
                text-[9px]
                font-medium
                uppercase
                leading-none
                tracking-[0.18em]
                text-[#FFFFFF]/55
                sm:text-[10px]
              "
            >
              Scroll To Explore
            </span>

            <span
              className="
                font-[var(--font-sans)]
                text-[11px]
                leading-none
                text-[#FFFFFF]/55
              "
            >
              →
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="
              fixed
              inset-0
              z-[200]
              flex
              items-center
              justify-center
              bg-[#00030C]/95
              p-4
              md:p-8
            "
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={closeImage}
          >
            {/* CLOSE */}

            <button
              type="button"
              aria-label="Close image"
              onClick={closeImage}
              className="
                absolute
                right-5
                top-5
                z-20
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#FFFFFF]/20
                bg-[#FFFFFF]/[0.03]
                text-[#FFFFFF]
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-[#FFFFFF]/40
                hover:bg-[#FFFFFF]/[0.08]
                md:right-8
                md:top-8
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>

            {/* IMAGE */}

            <motion.div
              className="
                relative
                h-[78vh]
                w-full
                max-w-[1400px]
              "
              initial={{
                scale: 0.96,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.96,
                opacity: 0,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Image
                src={BTS_IMAGES[selectedIndex].src}
                alt={BTS_IMAGES[selectedIndex].alt}
                fill
                priority
                sizes="100vw"
                className="object-contain grayscale"
              />
            </motion.div>

            {/* COUNTER */}

            <div
              className="
                absolute
                bottom-5
                left-1/2
                -translate-x-1/2
                font-[var(--font-sans)]
                text-[10px]
                font-medium
                leading-none
                tracking-[0.18em]
                text-[#FFFFFF]/55
                md:bottom-8
              "
            >
              {String(selectedIndex + 1).padStart(2, "0")}
              {" / "}
              {String(BTS_IMAGES.length).padStart(2, "0")}
            </div>

            {/* PREVIOUS */}

            <button
              type="button"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();

                setSelectedIndex(
                  (selectedIndex - 1 + BTS_IMAGES.length) % BTS_IMAGES.length,
                );
              }}
              className="
                absolute
                left-4
                top-1/2
                z-20
                hidden
                -translate-y-1/2
                items-center
                justify-center
                text-[#FFFFFF]/50
                transition-colors
                duration-300
                hover:text-[#FFFFFF]
                md:flex
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* NEXT */}

            <button
              type="button"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();

                setSelectedIndex((selectedIndex + 1) % BTS_IMAGES.length);
              }}
              className="
                absolute
                right-4
                top-1/2
                z-20
                hidden
                -translate-y-1/2
                items-center
                justify-center
                text-[#FFFFFF]/50
                transition-colors
                duration-300
                hover:text-[#FFFFFF]
                md:flex
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
