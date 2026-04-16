'use client';
import { usePathname } from "next/navigation";

const sectionNames = {
  hoteles: "Hoteles",
  habitaciones: "Habitaciones",
  reservas: "Reservas",
  inventario: "Inventario",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-base text-slate-400 font-medium" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li className="text-blue-700 font-bold">Dashboard</li>
        {segments.map((seg, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="mx-1">/</span>
            <span className={idx === segments.length - 1 ? "text-slate-900 font-bold" : ""}>
              {sectionNames[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
