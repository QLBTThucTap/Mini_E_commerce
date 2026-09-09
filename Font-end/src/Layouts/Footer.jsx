import SelectorPill from "../Components/common/SelectorPill";
import NewsletterForm from "../Components/common/NewsletterForm";

import IconButton from "../Components/ui/IconButton";
const SOCIALS = [
  { icon: "fa-brands fa-twitter", href: "#twitter" },
  { icon: "fa-brands fa-facebook-f", href: "#facebook" },
  { icon: "fa-brands fa-instagram", href: "#instagram" },
  { icon: "fa-brands fa-youtube", href: "#youtube" },
  { icon: "fa-solid fa-share-nodes", href: "#share" },
];

const PAYMENT_LOGOS = ["PayPal", "Mastercard", "VISA", "stripe", "Klarna."];

/**
 * columns: [{ title, links: [{ label, href }] }]  — pass 3 columns
 * (Top Categories / Company / Help Center) plus Partner is the 4th; keeping
 * them as data means Admin/marketing can edit link sets without touching JSX.
 */
export default function Footer({ columns, brand }) {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-12 mt-16">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="text-sm font-extrabold text-slate-900 tracking-wider">
              {brand.name}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                HOTLINE 24/7
              </div>
              <div className="text-2xl font-black text-emerald-600 tracking-tight mt-0.5">
                {brand.hotline}
              </div>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              {brand.address}
              <br />
              <a
                href={`mailto:${brand.email}`}
                className="hover:text-emerald-600"
              >
                {brand.email}
              </a>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {SOCIALS.map(({ icon, href }) => (
                <IconButton
                  key={href}
                  icon={icon}
                  href={href}
                  as="a"
                  size="sm"
                />
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                {col.title}
              </div>
              <ul className="text-xs text-slate-500 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-emerald-600">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-b border-slate-100 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex items-center gap-3">
            <SelectorPill label="USD" />
            <SelectorPill label="Eng" />
          </div>
          <div className="lg:col-span-8">
            <div className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              SUBSCRIBE &amp; GET <span className="text-red-500">10% OFF</span>{" "}
              FOR YOUR FIRST ORDER
            </div>
            <div className="mt-3">
              <NewsletterForm />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5">
              By subscribing, you accept our{" "}
              <a href="#policy" className="underline hover:text-slate-600">
                Policy
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()}{" "}
            <strong className="text-slate-700">{brand.name}</strong>. All Rights
            Reserved
          </div>
          <div className="flex items-center gap-4 opacity-80">
            {PAYMENT_LOGOS.map((name) => (
              <span
                key={name}
                className="font-extrabold text-slate-500 text-sm tracking-tight"
              >
                {name}
              </span>
            ))}
          </div>
          <a
            href="#mobile"
            className="text-blue-600 hover:underline font-semibold"
          >
            Mobile Site
          </a>
        </div>
      </div>
    </footer>
  );
}
