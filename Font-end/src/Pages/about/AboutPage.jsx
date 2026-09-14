import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import { FOOTER_BRAND, FOOTER_COLUMNS } from "../home/_constants/footer";

import AboutBreadcrumb from "./_components/AboutBreadcrumb";
import AboutHero from "./_components/AboutHero";
import AboutMetrics from "./_components/AboutMetrics";
import AboutWhoWeAre from "./_components/AboutWhoWeAre";
import AboutMission from "./_components/AboutMission";

import AboutCta from "./_components/AboutCta";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header từ project - không tạo lại Header/Topbar/CSS */}
      <Header />

      {/* Breadcrumb Navigation */}
      <AboutBreadcrumb />

      {/* Main Content Sections */}
      <main className="max-w-[1360px] mx-auto px-4 py-6 sm:py-8 space-y-8 sm:space-y-10 flex-1 w-full">
        {/* Section 1: Hero Banner */}
        <AboutHero />

        {/* Section 2: Statistics & Purpose */}
        <AboutMetrics />

        {/* Section 3: Who We Are & Story */}
        <AboutWhoWeAre />

        {/* Section 4: Mission, Vision & Modern Tech Center */}
        <AboutMission />
        
        <AboutCta />
      </main>

      {/* Footer từ project - tái sử dụng brand & columns hiện có */}
      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
