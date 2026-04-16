// habitaciones/page.js
"use client";
import { useState, useEffect } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import RoomCards from "../RoomCards";
import Modal from "../Modal";
import RoomTypeForm from "../RoomTypeForm";

const initialRoomTypes = [];

export default function HabitacionesPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterHotel, setFilterHotel] = useState("");
  const [filterType, setFilterType] = useState("");


  const handleCreate = (room) => {
    if (editingRoom) {
      if (room && room.id) {
        setRoomTypes((prev) => prev.map(r => r.id === editingRoom.id ? { ...r, ...room } : r));
      } else {
        fetchRoomTypes();
      }
      setEditingRoom(null);
    } else {
      if (room && room.id) setRoomTypes((prev) => [...prev, room]);
      else fetchRoomTypes();
    }
    setModalOpen(false);
  };
  const handleEdit = (room) => {
    setEditingRoom(room);
    setModalOpen(true);
  };
  const handleDelete = (room) => {
    setRoomTypes((prev) => prev.filter((r) => r.id !== room.id));
    (async () => {
      try {
        await fetch(`${API_BASE}/api/RoomTypes/${room.id}`, { method: 'DELETE' });
        fetchRoomTypes();
      } catch (e) {}
    })();
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/RoomTypes?page=1&pageSize=200`);
      if (!res.ok) return;
      const data = await res.json();
      setRoomTypes(data.items || []);
    } catch (e) {}
  };

  useEffect(() => { fetchRoomTypes(); }, []);

  const uniqueTypes = Array.from(new Set(roomTypes.map(r => r.name))).filter(Boolean);
  const uniqueHotels = Array.from(new Set(roomTypes.map(r => r.hotelId))).filter(Boolean);

  const metrics = [
    { label: "Tipos de Habitación", value: uniqueTypes.length, icon: "🛏️", color: "bg-violet-100 text-violet-700" },
    { label: "Capacidad Total", value: roomTypes.reduce((a, r) => a + (Number(r.capacity) || 0), 0), icon: "👥", color: "bg-blue-100 text-blue-700" },
    { label: "Hoteles con habitaciones", value: uniqueHotels.length, icon: "🏨", color: "bg-emerald-100 text-emerald-700" },
  ];

  const filteredRoomTypes = roomTypes.filter(r =>
    (!filterType || r.name === filterType) &&
    (!filterName || r.name?.toLowerCase().includes(filterName.toLowerCase())) &&
    (!filterCapacity || String(r.capacity).includes(filterCapacity)) &&
    (!filterHotel || String(r.hotelId).includes(filterHotel))
  );

  return (
    <section>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Habitaciones</h1>
      <p className="text-slate-500 mb-8">Gestiona los tipos de habitación disponibles en tu red hotelera.</p>

      {/* Métricas */}
      <div className="metric-grid" style={{ marginBottom: 24 }}>
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="metric-icon">{m.icon}</div>
            <div style={{display:'flex', flexDirection:'column'}}>
              <div className="metric-value">{m.value ?? '—'}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filters-row" style={{ marginBottom: 12 }}>
        <div className="controls" style={{ flex: 1 }}>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo</label>
          <select className="filter-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Todos</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
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
          <label className="block text-xs font-semibold text-slate-500 mb-1">Capacidad</label>
          <input
            className="filter-input"
            placeholder="Capacidad..."
            value={filterCapacity}
            onChange={e => setFilterCapacity(e.target.value)}
            type="number"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Hotel</label>
          <select className="filter-input" value={filterHotel} onChange={e => setFilterHotel(e.target.value)}>
            <option value="">Todos</option>
            {uniqueHotels.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        </div>
        <div style={{ marginLeft: 12 }}>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Nueva habitación</button>
        </div>
      </div>

      {filteredRoomTypes.length === 0 ? (
        <div className="empty-state card" style={{ padding: 36, marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#334155', marginBottom: 8 }}>No hay habitaciones registradas</div>
          <div style={{ color: '#64748b', marginBottom: 18 }}>Agrega una nueva habitación usando el botón</div>
          <div>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Nueva habitación</button>
          </div>
        </div>
      ) : (
        <RoomCards rooms={filteredRoomTypes} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingRoom(null); }}>
        <h2 className="text-xl font-bold mb-4">{editingRoom ? 'Editar habitación' : 'Registrar habitación'}</h2>
        <RoomTypeForm initialData={editingRoom} onSubmit={handleCreate} onCancel={() => { setModalOpen(false); setEditingRoom(null); }} />
      </Modal>
    </section>
  );
}
