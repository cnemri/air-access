import Header from "./_components/header/Header";
import AnalysisSection from "./_components/sections/analysis/AnalysisSection";
import PropertySection from "./_components/sections/property/PropertySection";
import ReportSection from "./_components/sections/report/ReportSection";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="grow overflow-y-auto bg-slate-50">
        <main className="no-scrollbar container mx-auto flex flex-col items-center justify-center gap-5 overflow-y-auto p-5">
          <PropertySection />
          <AnalysisSection />
          <ReportSection />
        </main>
      </div>
    </div>
  );
}
