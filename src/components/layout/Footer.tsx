export default function Footer() {
  return (
    <footer className="bg-[#00030C] px-5 py-8 text-[#FFFFFF] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px] text-center">
        <p className="font-[var(--font-sans)] text-[9px] font-normal tracking-[0.08em] sm:text-[10px]">
          © {new Date().getFullYear()} Fadhil Rahmat
        </p>
      </div>
    </footer>
  );
}
