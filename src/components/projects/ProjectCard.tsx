"use client";

import { useState } from "react";

import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: () => void;
}

export default function ProjectCard({
  project,
  index,
  onOpen,
}: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group">
      <button
        type="button"
        onClick={onOpen}
        className="
          relative
          block
          w-full
          cursor-pointer
          overflow-hidden
          text-left
        "
        aria-label={`Open ${project.title}`}
      >
        <div
          className="
            relative
            aspect-[16/10]
            w-full
            overflow-hidden
            bg-[#080A0F]
          "
        >
          {project.thumbnail && !imageError ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              onError={() => setImageError(true)}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-[var(--ease-smooth)]
                group-hover:scale-[1.025]
              "
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                justify-between
                bg-[#080A0F]
                p-5
                sm:p-6
              "
            >
              <div
                className="
                  h-px
                  w-8
                  bg-[#FFFFFF]/30
                  transition-all
                  duration-500
                  group-hover:w-14
                "
              />

              <div>
                <p
                  className="
                    mb-2
                    font-[var(--font-sans)]
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#FFFFFF]/35
                  "
                >
                  {project.category}
                </p>

                <p
                  className="
                    max-w-[85%]
                    font-[var(--font-sans)]
                    text-[12px]
                    font-medium
                    uppercase
                    leading-[1.2]
                    tracking-[0.02em]
                    text-[#FFFFFF]/70
                    sm:text-[14px]
                  "
                >
                  {project.title}
                </p>
              </div>
            </div>
          )}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[#00030C]/10
              transition-colors
              duration-500
              group-hover:bg-[#00030C]/0
            "
          />

          <div
            className="
              absolute
              left-4
              top-4
              font-[var(--font-sans)]
              text-[9px]
              font-medium
              tracking-[0.16em]
              text-[#FFFFFF]
              drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]
              sm:left-5
              sm:top-5
              sm:text-[10px]
            "
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          <div
            className="
              absolute
              bottom-4
              right-4
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[#FFFFFF]/40
              bg-[#00030C]/20
              text-[#FFFFFF]
              opacity-0
              backdrop-blur-sm
              transition-all
              duration-500
              group-hover:opacity-100
              sm:bottom-5
              sm:right-5
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
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </button>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3
            className="
              truncate
              font-[var(--font-sans)]
              text-[14px]
              font-medium
              uppercase
              tracking-[0.02em]
              text-[#FFFFFF]
              sm:text-[15px]
            "
          >
            {project.title}
          </h3>

          <p
            className="
              mt-1.5
              font-[var(--font-sans)]
              text-[10px]
              font-normal
              uppercase
              tracking-[0.14em]
              text-[#FFFFFF]/55
              sm:text-[11px]
            "
          >
            {project.category}
          </p>
        </div>

        <span
          className="
            shrink-0
            pt-0.5
            font-[var(--font-sans)]
            text-[10px]
            font-medium
            tracking-[0.12em]
            text-[#FFFFFF]/55
            sm:text-[11px]
          "
        >
          {project.year}
        </span>
      </div>
    </article>
  );
}
