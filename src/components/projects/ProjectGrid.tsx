"use client";

import { useEffect, useState } from "react";

import type { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import ProjectPlayer from "./ProjectPlayer";

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Failed to load projects.");
        }

        const data: Project[] = await response.json();

        setProjects(data);
      } catch (error) {
        console.error("Project loading error:", error);
        setError("Unable to load projects.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

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

  if (projects.length === 0) {
    return (
      <div className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.16em] text-[#FFFFFF]/50">
        No Projects Available.
      </div>
    );
  }

  return (
    <>
      <div
        className="
          grid grid-cols-1 gap-x-5 gap-y-14
          sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16
          lg:grid-cols-3 lg:gap-x-7 lg:gap-y-20
        "
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onOpen={() => setSelectedProject(project)}
          />
        ))}
      </div>

      <ProjectPlayer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
