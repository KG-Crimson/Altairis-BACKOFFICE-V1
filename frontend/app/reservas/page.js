// reservas/page.js
"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import BookingTable from "../BookingTable";
import BookingCards from "../BookingCards";
import Modal from "../Modal";
import BookingForm from "../BookingForm";

const initialBookings = [];

export default function ReservasPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filterGuest, setFilterGuest] = useState("");
  const [filterHotel, setFilterHotel] = useState("");
  const [filterRoomType, setFilterRoomType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotelMap, setHotelMap] = useState({});
  const [roomTypeMap, setRoomTypeMap] = useState({});

  const metrics = [
    { label: "Reservas activas", value: bookings.length, icon: "📅", color: "bg-blue-100 text-blue-700" },
    { label: "Ocupación promedio", value: null, icon: "📈", color: "bg-violet-100 text-violet-700" },
    { label: "Clientes únicos", value: new Set(bookings.map(b => b.guestName)).size || null, icon: "🧑‍💼", color: "bg-emerald-100 text-emerald-700" },
  ];

  const handleCreate = (booking) => {
    if (editingBooking) {
      if (booking && booking.id) {
        setBookings((prev) => prev.map(b => b.id === booking.id ? booking : b));
      } else {
        fetchBookings();
      }
      setEditingBooking(null);
    } else {
      if (booking && booking.id) setBookings((prev) => [...prev, booking]);
      else fetchBookings();
    }
    setModalOpen(false);
  };
  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setModalOpen(true);
  };
  const handleDelete = (booking) => {
    setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    (async () => {
      try {
        await fetch(`${API_BASE}/api/Bookings/${booking.id}`, { method: 'DELETE' });
        fetchBookings();
      } catch (e) {}
    })();
  };

  useEffect(() => {
    (async () => {
      try {
        const [hRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/api/Hotels?page=1&pageSize=200`),
          fetch(`${API_BASE}/api/RoomTypes?page=1&pageSize=500`)
        ]);

        if (hRes.ok) {
          const h = await hRes.json();
          const items = h && Array.isArray(h.items) ? h.items : [];
          setHotels(items);
          const map = {};
          items.forEach(item => { map[String(item.id)] = item.name ?? item.title ?? item.id; });
          setHotelMap(map);
        }

        if (rRes.ok) {
          const rt = await rRes.json();
          const items = rt && Array.isArray(rt.items) ? rt.items : [];
          setRoomTypes(items);
          const map2 = {};
          items.forEach(item => { map2[String(item.id)] = item.name ?? item.title ?? item.id; });
          setRoomTypeMap(map2);
        }
      } catch (e) {
      }
    })();
  }, []);

  const fetchBookings = async (p = 1, ps = 200) => {
    try {
      const res = await fetch(`${API_BASE}/api/Bookings?page=${p}&pageSize=${ps}`);
      if (!res.ok) return;
      const data = await res.json();
      setBookings(data.items || []);
    } catch (e) {}
  };

  useEffect(() => { fetchBookings(); }, []);

  const filteredBookings = bookings.filter(b =>
    (!filterGuest || b.guestName?.toLowerCase().includes(filterGuest.toLowerCase())) &&
    (!filterHotel || String(b.hotelId) === String(filterHotel)) &&
    (!filterRoomType || String(b.roomTypeId) === String(filterRoomType)) &&
    (!filterStatus || (b.status || "").toLowerCase().includes(filterStatus.toLowerCase()))
  );

  return (
    <section>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Reservas</h1>
      <p className="text-slate-500 mb-8">Gestiona y supervisa todas las reservas de tu red hotelera.</p>

          <div className="metric-grid" style={{ marginBottom: 24 }}>
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
      <div className="controls">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Huésped</label>
          <input
            className="filter-input"
            placeholder="Buscar huésped..."
            value={filterGuest}
            onChange={e => setFilterGuest(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Hotel</label>
          <select
            className="filter-input compact"
            value={filterHotel}
            onChange={e => setFilterHotel(e.target.value)}
          >
            <option value="">Todos</option>
            {hotels.map(h => (
              <option key={h.id} value={h.id}>{h.name ?? h.title ?? h.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo</label>
          <select
            className="filter-input compact"
            value={filterRoomType}
            onChange={e => setFilterRoomType(e.target.value)}
          >
            <option value="">Todos</option>
            {roomTypes.map(r => (
              <option key={r.id} value={r.id}>{r.name ?? r.title ?? r.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Estado</label>
          <input
            className="filter-input compact"
            placeholder="Estado..."
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          />
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1rem'}}>
        <div style={{ fontWeight: 800, color: '#334155' }}> </div>
        <button className="btn btn-primary" onClick={() => { setEditingBooking(null); setModalOpen(true); }}>+ Nueva reserva</button>
      </div>
      {filteredBookings.length === 0 ? (
        <div className="empty-state card" style={{ padding: 36, marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#334155', marginBottom: 8 }}>No hay reservas registradas</div>
          <div style={{ color: '#64748b', marginBottom: 18 }}>Agrega una nueva reserva usando el botón</div>
          <div>
            <button className="btn btn-primary" onClick={() => { setEditingBooking(null); setModalOpen(true); }}>+ Nueva reserva</button>
          </div>
        </div>
      ) : (
        <BookingCards
          bookings={filteredBookings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hotelMap={hotelMap}
          roomTypeMap={roomTypeMap}
        />
      )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingBooking(null); }}>
        <h2 className="text-xl font-bold mb-4">{editingBooking ? 'Editar reserva' : 'Registrar reserva'}</h2>
        <BookingForm
          initialData={editingBooking}
          onSubmit={handleCreate}
          onCancel={() => { setModalOpen(false); setEditingBooking(null); }}
          hotelOptions={hotels}
          roomTypeOptions={roomTypes}
        />
      </Modal>
    </section>
  );
}
