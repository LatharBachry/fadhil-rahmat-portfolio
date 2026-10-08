"use client";

import { useEffect, useMemo, useState } from "react";

import type { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import ProjectFilter from "./ProjectFilter";
import ProjectPlayer from "./ProjectPlayer";

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load projects.");
        }

        const data: Project[] = await response.json();

        /*
         * Parse category from the FIRST underscore.
         *
         * Example:
         *
         * SHORT MOVIE_PLN MOBILE
         * -> category: SHORT MOVIE
         * -> title: PLN MOBILE
         *
         * MUSIC VIDEO_SALMA_MAHA BENAR
         * -> category: MUSIC VIDEO
         * -> title: SALMA_MAHA BENAR
         */
        const parsedProjects = data.map((project) => {
          const separatorIndex = project.title.indexOf("_");

          if (separatorIndex === -1) {
            return {
              ...project,
              category: project.category?.trim().toUpperCase() || "OTHER",
              title: project.title.trim(),
            };
          }

          return {
            ...project,
            category: project.title
              .slice(0, separatorIndex)
              .trim()
              .toUpperCase(),
            title: project.title.slice(separatorIndex + 1).trim(),
          };
        });

        /*
         * Sort title from Z → A.
         */
        const sortedProjects = [...parsedProjects].sort((a, b) =>
          b.title.localeCompare(a.title, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        );

        setProjects(sortedProjects);
      } catch (error) {
        console.error("Project loading error:", error);
        setError("Unable to load projects.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  /*
   * Build category list automatically
   * from all available projects.
   */
  const categories = useMemo(() => {
    return Array.from(
      new Set(
        projects
          .map((project) => project.category.trim().toUpperCase())
          .filter(Boolean),
      ),
    ).sort((a, b) =>
      a.localeCompare(b, undefined, {
        sensitivity: "base",
      }),
    );
  }, [projects]);

  /*
   * Filter projects by selected category.
   */
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
      <div className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.16em] text-[#FFFFFF]/50">
        Loading Projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.16em] text-[#FFFFFF]/50">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* SECTION HEADER */}
      <div
        className="
          mb-14
          flex
          flex-col
          gap-8
          sm:mb-16
          lg:mb-20
          lg:flex-row
          lg:items-end
          lg:justify-between
          lg:gap-12
        "
      >
        <div className="shrink-0">
          <p className="mb-4 font-[var(--font-sans)] text-[9px] font-medium uppercase leading-none tracking-[0.20em] text-[#FFFFFF]/70 sm:text-[10px]">
            All Projects
          </p>

          <h2
            className="
              text-[clamp(3rem,5vw,5rem)]
              font-normal
              uppercase
              leading-[0.86]
              tracking-[-0.02em]
              text-[#FFFFFF]
            "
            style={{ fontFamily: "var(--font-display)" }}
          >
            ALL
            <br />
            PROJECTS.
          </h2>
        </div>

        {/* CATEGORY FILTER */}
        {categories.length > 0 && (
          <ProjectFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        )}
      </div>

      {/* PROJECT GRID */}
      {projects.length === 0 ? (
        <div className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.16em] text-[#FFFFFF]/50">
          No Projects Available.
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.16em] text-[#FFFFFF]/50">
          No Projects In This Category.
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            gap-x-5
            gap-y-14
            sm:grid-cols-2
            sm:gap-x-6
            sm:gap-y-16
            lg:grid-cols-3
            lg:gap-x-7
            lg:gap-y-20
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

      <ProjectPlayer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
