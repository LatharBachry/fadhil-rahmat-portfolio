import ProjectGrid from "@/components/projects/ProjectGrid";

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-[#00030C] text-[#FFFFFF]">
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <ProjectGrid />
      </div>
    </section>
  );
}
