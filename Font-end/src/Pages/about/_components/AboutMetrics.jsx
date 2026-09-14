import Card from "../../../Components/ui/Card";
import { ABOUT_METRICS } from "../_constants/about";

export default function AboutMetrics() {
  const sloganItem = ABOUT_METRICS.find((m) => m.type === "slogan");
  const statItems = ABOUT_METRICS.filter((m) => m.type === "stat");

  return (
    <Card padding="p-6 sm:p-8" className="shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Purpose Statement */}
        <div className="pr-0 md:pr-6 pb-6 md:pb-0">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide leading-relaxed text-slate-800">
            {sloganItem.text}{" "}
            <span className="text-emerald-600">{sloganItem.highlight}</span>{" "}
            {sloganItem.suffix}
          </p>
        </div>

        {/* Dynamic Metric Columns */}
        {statItems.map((stat, idx) => (
          <div key={idx} className="pt-6 md:pt-0 md:pl-8">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
              {stat.value}
            </div>
            <div className="text-xs uppercase font-semibold text-slate-400 mt-1.5 leading-snug">
              {stat.label}
              <br />
              <span className="text-slate-500 font-bold">{stat.sublabel}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
