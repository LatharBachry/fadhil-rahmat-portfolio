import ProjectGrid from "@/components/projects/ProjectGrid";

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-[#00030C] text-[#FFFFFF]">
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="mb-14 sm:mb-16 lg:mb-20">
          <p className="mb-4 font-[var(--font-sans)] text-[9px] font-medium uppercase leading-none tracking-[0.20em] text-[#FFFFFF]/70 sm:text-[10px]">
            All Projects
          </p>

          <h2
            className="text-[clamp(3rem,5vw,5rem)] font-normal uppercase leading-[0.86] tracking-[-0.02em] text-[#FFFFFF]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ALL
            <br />
            PROJECTS.
          </h2>
        </div>

        <ProjectGrid />
      </div>
    </section>
  );
}
