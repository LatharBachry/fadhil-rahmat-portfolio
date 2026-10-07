"use client";

import { useEffect } from "react";
import type { Project } from "@/types/project";

interface ProjectPlayerProps {
  project: Project | null;
  onClose: () => void;
}

function getGoogleDriveEmbedUrl(url: string) {
  const match = url.match(/\/d\/([^/]+)/);

  if (!match) {
    return url;
  }

  const fileId = match[1];

  return `https://drive.google.com/file/d/${fileId}/preview`;
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

  const embedUrl = getGoogleDriveEmbedUrl(project.video);

  return (
    <div
      className="
        fixed
        inset-0
        z-[300]
        flex
        items-center
        justify-center
        bg-[#00030C]/[0.97]
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
        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div
          className="
            mb-3
            flex
            min-h-[42px]
            items-center
            justify-between
            gap-6
          "
        >
          {/* PROJECT INFO */}

          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-3
                font-[var(--font-sans)]
                text-[8px]
                font-medium
                uppercase
                leading-none
                tracking-[0.18em]
                text-[#FFFFFF]/45
                sm:text-[9px]
              "
            >
              <span>{project.category}</span>

              <span className="h-px w-4 bg-[#FFFFFF]/20" />

              <span>{project.year}</span>
            </div>

            <h2
              className="
                mt-2
                truncate
                font-[var(--font-sans)]
                text-[12px]
                font-medium
                uppercase
                leading-none
                tracking-[0.02em]
                text-[#FFFFFF]
                sm:text-[14px]
              "
            >
              {project.title}
            </h2>
          </div>

          {/* CLOSE BUTTON */}

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

        {/* =====================================================
            VIDEO PLAYER
        ===================================================== */}

        <div
          className="
            relative
            w-full
            overflow-hidden
            bg-black
            aspect-video
          "
        >
          <iframe
            src={embedUrl}
            title={project.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="
              absolute
              inset-0
              h-full
              w-full
              border-0
            "
          />

          {/* Subtle cinematic frame */}

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

        {/* =====================================================
            BOTTOM META
        ===================================================== */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
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
