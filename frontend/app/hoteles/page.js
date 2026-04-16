// hoteles/page.js
"use client";
import { useState, useEffect } from "react";
import HotelTable from "../HotelTable";
import HotelCards from "../HotelCards";
import Modal from "../Modal";
import HotelForm from "../HotelForm";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function HotelesPage() {
  const [hotels, setHotels] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const metrics = [
    { label: "Total Hoteles", value: hotels.length, icon: "🏨", color: "bg-blue-100 text-blue-700" },
    { label: "Habitaciones Activas", value: null, icon: "🛏️", color: "bg-violet-100 text-violet-700" },
    { label: "Regiones", value: null, icon: "🌎", color: "bg-emerald-100 text-emerald-700" },
  ];

  const handleCreate = (hotel) => {
    if (editingHotel) {
      setHotels((prev) => prev.map(h => h.id === editingHotel.id ? { ...h, ...hotel } : h));
    } else {
      if (hotel && hotel.id) {
        setHotels((prev) => [...prev, hotel]);
      } else {
        fetchHotels();
      }
    }
    setEditingHotel(null);
    setModalOpen(false);
  };
  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setModalOpen(true);
  };
  const handleDelete = (hotel) => {
    setHotels((prev) => prev.filter((h) => h.id !== hotel.id));
    (async () => {
      try {
        await fetch(`${API_BASE}/api/Hotels/${hotel.id}`, { method: 'DELETE' });
        fetchHotels();
      } catch (e) {
      }
    })();
  };

  const fetchHotels = async (p = page, ps = pageSize) => {
    try {
      const res = await fetch(`${API_BASE}/api/Hotels?page=${p}&pageSize=${ps}`);
      if (!res.ok) return;
      const data = await res.json();
      setHotels(data.items || []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [page, pageSize]);

  const handleApplyFilters = () => {
    setPage(1);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };


  const filteredHotels = hotels.filter(h =>
    (!filterName || h.name?.toLowerCase().includes(filterName.toLowerCase())) &&
    (!filterCity || h.city?.toLowerCase().includes(filterCity.toLowerCase())) &&
    (!filterCountry || h.country?.toLowerCase().includes(filterCountry.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / pageSize));
  const paginatedHotels = filteredHotels.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 8 }}>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Hoteles</h1>
          <p className="text-slate-500">Supervisa y gestiona el inventario global de tu red hotelera.</p>
        </div>
      </div>

      {/* Métricas en tarjetas */}
      <div className="metric-grid" style={{ marginTop: 12, marginBottom: 24 }}>
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="metric-icon">{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="metric-value">{m.value ?? '—'}</div>
              <div className="metric-label">{m.label}</div>
              {m.meta && <div className="metric-meta">{m.meta}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="controls" style={{ alignItems: 'flex-end' }}>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre</label>
          <input
            className="filter-input"
            placeholder="Buscar nombre..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Ciudad</label>
          <input
            className="filter-input"
            placeholder="Buscar ciudad..."
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">País</label>
          <input
            className="filter-input"
            placeholder="Buscar país..."
            value={filterCountry}
            onChange={e => setFilterCountry(e.target.value)}
          />
        </div>
        <div className="controls-right" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-filter" onClick={handleApplyFilters}>Filtrar</button>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Nuevo hotel</button>
        </div>
      </div>
      {paginatedHotels.length === 0 ? (
        <div className="empty-state card" style={{ padding: 36, marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#334155', marginBottom: 8 }}>No hay hoteles registrados</div>
          <div style={{ color: '#64748b', marginBottom: 18 }}>Agrega un nuevo hotel usando el botón</div>
          <div>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Nuevo hotel</button>
          </div>
        </div>
      ) : (
        <HotelCards hotels={paginatedHotels} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded bg-slate-100 text-slate-600 font-semibold disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >Anterior</button>
          <span className="text-slate-700 font-medium">Página {page} de {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-slate-100 text-slate-600 font-semibold disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >Siguiente</button>
        </div>
        <div>
          <label className="text-xs text-slate-500 mr-2">Por página:</label>
          <select
            className="px-2 py-1 rounded border border-slate-200 bg-white"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingHotel(null); }}>
        <h2 className="text-xl font-bold mb-4">{editingHotel ? 'Editar hotel' : 'Registrar hotel'}</h2>
        <HotelForm initialData={editingHotel} onSubmit={handleCreate} onCancel={() => { setModalOpen(false); setEditingHotel(null); }} />
      </Modal>
    </section>
  );
}
