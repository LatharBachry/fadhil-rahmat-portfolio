"use client";

import { useEffect, useMemo, useState } from "react";

import type { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import ProjectPlayer from "./ProjectPlayer";

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load projects.");
        }

        const data: Project[] = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Project loading error:", err);
        setError("Unable to load projects.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((project) => project.category.trim().toUpperCase())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [projects],
  );

  const filterCategories = useMemo(
    () => [
      { name: "ALL", count: projects.length },
      ...categories.map((category) => ({
        name: category,
        count: projects.filter(
          (project) => project.category.trim().toUpperCase() === category,
        ).length,
      })),
    ],
    [categories, projects],
  );

  const filteredProjects = useMemo(() => {
    if (activeCategory === "ALL") {
      return projects;
    }

    return projects.filter(
      (project) => project.category.trim().toUpperCase() === activeCategory,
    );
  }, [projects, activeCategory]);

  if (isLoading) {
    return (
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">
        Loading Projects...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">
        {error}
      </p>
    );
  }

  return (
    <>
      {/* HEADER */}
      <section className="mb-10 sm:mb-12 lg:mb-14">
        <div className="mb-10 sm:mb-12">
          <p className="mb-4 font-[var(--font-sans)] text-[9px] font-medium uppercase tracking-[0.2em] text-white/70 sm:text-[10px]">
            All Projects
          </p>

          <h2
            className="text-[clamp(3rem,5vw,5rem)] font-normal uppercase leading-[0.86] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ALL
            <br />
            PROJECTS.
          </h2>
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="w-full min-w-0">
          <div className="flex w-full min-w-0 flex-wrap gap-2 sm:gap-2.5">
            {filterCategories.map((category) => {
              const isActive = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category.name)}
                  className={`
                    group inline-flex min-h-[36px] shrink-0
                    items-center justify-center gap-2.5
                    border px-3 py-2
                    font-[var(--font-sans)]
                    text-[9px] font-medium uppercase
                    tracking-[0.08em]
                    transition-colors duration-300 ease-out
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-white
                    ${
                      isActive
                        ? "border-white bg-white text-black"
                        : "border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-black"
                    }
                  `}
                >
                  <span
                    className={`whitespace-nowrap ${
                      isActive
                        ? "!text-black"
                        : "text-white group-hover:!text-black"
                    }`}
                  >
                    {category.name}
                  </span>

                  <span
                    className={`
                      text-[11px] font-bold leading-none tabular-nums
                      transition-colors duration-300
                      ${
                        isActive
                          ? "!text-black"
                          : "text-white/80 group-hover:!text-black"
                      }
                    `}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE PROJECT COUNT — RIGHT SIDE */}
        <div className="mt-5 flex items-center justify-end border-t border-white/15 pt-4">
          <p
            aria-live="polite"
            className="flex items-baseline gap-2 font-[var(--font-sans)] text-[9px] uppercase tracking-[0.12em] text-white/50 sm:text-[10px]"
          >
            <span className="text-[24px] font-bold leading-none tracking-[-0.04em] text-white tabular-nums sm:text-[30px]">
              {filteredProjects.length}
            </span>
            <span>Projects</span>
          </p>
        </div>
      </section>

      {/* PROJECT GRID */}
      {filteredProjects.length === 0 ? (
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">
          No Projects Available.
        </p>
      ) : (
        <div
          className="
            grid grid-cols-1 gap-x-5 gap-y-14
            sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16
            lg:grid-cols-3 lg:gap-x-7 lg:gap-y-20
          "
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() => setSelectedProject(project)}
            />
          ))}
        </div>
      )}

      {/* PROJECT PLAYER */}
      <ProjectPlayer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
