"use client";

import { useEffect } from "react";
import type { Project } from "@/types/project";

interface ProjectPlayerProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectPlayer({
  project,
  onClose,
}: ProjectPlayerProps) {
  useEffect(() => {
    if (!project) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  const videoUrl = `/api/projects/${project.id}/video`;

  return (
    <div
      className="
        fixed
        inset-0
        z-[300]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-[#00030C]
        px-4
        py-6
        sm:px-6
        sm:py-8
        lg:px-10
        lg:py-10
      "
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <div
        className="
          relative
          flex
          w-full
          max-w-[1100px]
          flex-col
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-3
            flex
            min-h-[40px]
            items-start
            justify-between
            gap-4
            sm:min-h-[42px]
          "
        >
          <div className="min-w-0 flex-1">
            <div
              className="
    flex
    items-center
    gap-3
    font-[var(--font-sans)]
    text-[7px]
    font-medium
    uppercase
    leading-none
    tracking-[0.18em]
    text-[#FFFFFF]/45
    sm:text-[9px]
  "
            >
              <span>{project.category}</span>
            </div>

            <h2
              className="
                mt-1.5
                max-w-[calc(100vw-100px)]
                truncate
                font-[var(--font-sans)]
                text-[10px]
                font-medium
                uppercase
                leading-none
                tracking-[0.02em]
                text-[#FFFFFF]
                sm:mt-2
                sm:max-w-none
                sm:text-[14px]
              "
            >
              {project.title}
            </h2>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project player"
            className="
              group
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#FFFFFF]/25
              bg-[#FFFFFF]/[0.04]
              text-[#FFFFFF]/75
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-[#FFFFFF]/50
              hover:bg-[#FFFFFF]/[0.09]
              hover:text-[#FFFFFF]
              sm:h-10
              sm:w-10
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:rotate-90
              "
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* =================================================
            VIDEO
        ================================================= */}

        <div
          className="
            relative
            w-full
            overflow-hidden
            bg-black
            aspect-video
          "
        >
          <video
            src={videoUrl}
            poster={project.thumbnail}
            controls
            playsInline
            preload="metadata"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-contain
              bg-black
            "
          />

          {/* Subtle frame */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              ring-1
              ring-inset
              ring-[#FFFFFF]/[0.08]
            "
          />
        </div>

        {/* =================================================
            FOOTER
            Desktop only
        ================================================= */}

        <div
          className="
            mt-3
            hidden
            items-center
            justify-between
            sm:flex
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              font-[var(--font-sans)]
              text-[8px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[#FFFFFF]/30
              sm:text-[9px]
            "
          >
            <span>Fadhil Rahmat</span>

            <span className="h-px w-4 bg-[#FFFFFF]/15" />

            <span>Video Editor</span>
          </div>

          <span
            className="
              font-[var(--font-sans)]
              text-[8px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#FFFFFF]/25
            "
          >
            ESC TO CLOSE
          </span>
        </div>
      </div>
    </div>
  );
}
