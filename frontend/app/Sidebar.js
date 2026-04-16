"use client";

import { Home, Hotel, BedDouble, CalendarCheck2, Boxes } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Hoteles", icon: Hotel, href: "/hoteles" },
  { name: "Habitaciones", icon: BedDouble, href: "/habitaciones" },
  { name: "Reservas", icon: CalendarCheck2, href: "/reservas" },
  { name: "Inventario", icon: Boxes, href: "/inventario" },
];

export default function Sidebar() {
  const pathname = usePathname() || "/";

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Altairis</div>
        <div className="sidebar-subtitle">BackOffice</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ name, icon: Icon, href }, idx) => {
          const active = isActive(href);
          return (
            <div key={name} className={idx < navItems.length - 1 ? 'divider' : ''}>
              <Link href={href} className={`nav-item ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
                <span className="nav-icon"><Icon size={18} /></span>
                <span className="nav-label">{name}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Altairis Management v1.0</div>
    </aside>
  );
}
