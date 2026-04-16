// inventario/page.js
"use client";
import { useState, useEffect } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import Modal from "../Modal";
import InventoryForm from "../InventoryForm";


export default function InventarioPage() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotelsMap, setHotelsMap] = useState({});
  const [dates, setDates] = useState([]);
  const [data, setData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInitial, setEditingInitial] = useState(null);

  const metrics = [
    { label: "Tipos de Habitación", value: rooms.length || null, icon: "🛏️", color: "bg-violet-100 text-violet-700" },
    { label: "Fechas monitoreadas", value: dates.length || null, icon: "📅", color: "bg-blue-100 text-blue-700" },
    { label: "Registros totales", value: Object.values(data).reduce((a, r) => a + Object.keys(r).length, 0) || null, icon: "📦", color: "bg-emerald-100 text-emerald-700" },
  ];

  const handleCreate = ({ roomId, date, status }) => {
    setModalOpen(false);
    fetchInventories();
  };

  const fetchInventories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/Inventories?page=1&pageSize=500`);
      if (!res.ok) return;
      const json = await res.json();
      const items = json.items || [];
      const rtRes = await fetch(`${API_BASE}/api/RoomTypes?page=1&pageSize=500`);
      const rtJson = rtRes.ok ? await rtRes.json() : { items: [] };
      const roomMap = new Map();
      (rtJson.items || []).forEach(r => {
        const key = String(r.id);
        if (!roomMap.has(key)) roomMap.set(key, { id: key, name: r.name, hotelId: r.hotelId });
      });
      const roomList = Array.from(roomMap.values());
      setRoomTypes(rtJson.items || []);
      const hRes = await fetch(`${API_BASE}/api/Hotels?page=1&pageSize=500`);
      if (hRes.ok) {
        const hJson = await hRes.json();
        const map = {};
        (hJson.items || []).forEach(h => { map[String(h.id)] = h.name ?? h.title ?? h.id; });
        setHotelsMap(map);
      }
      const datesSet = new Set();
      const map = {};
      items.forEach(it => {
        const rid = String(it.roomTypeId || it.roomId || it.roomType?.id || it.id);
        const d = (it.date || it.dateString || '').split('T')[0];
        datesSet.add(d);
        map[rid] = map[rid] || {};
        const avail = Number(it.availableRooms || 0);
        const status = avail === 0 ? 'agotado' : (avail <= 2 ? 'pocas' : 'disponible');
        map[rid][d] = { id: it.id || null, status, needsCleaning: Boolean(it.needsCleaning), availableRooms: avail };
      });
      setRooms(roomList);
      const dateArr = Array.from(datesSet).sort();
      setDates(dateArr);
      setData(map);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => { fetchInventories(); }, []);

  const toggleCleaning = async (roomId, date) => {
    try {
      const entry = (data[String(roomId)] || {})[date];
      const isNow = !Boolean(entry && entry.needsCleaning);
      const hotelId = (roomTypes.find(r => String(r.id) === String(roomId)) || {}).hotelId || 1;
      const availableRooms = entry ? (entry.availableRooms ?? 0) : 10;
      let res;
      if (entry && entry.id) {
        const payload = { id: entry.id, roomTypeId: Number(roomId), hotelId: Number(hotelId), date, availableRooms: Number(availableRooms), needsCleaning: Boolean(isNow) };
        res = await fetch(`${API_BASE}/api/Inventories/${entry.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        const payload = { roomTypeId: Number(roomId), hotelId: Number(hotelId), date, availableRooms: Number(availableRooms), needsCleaning: Boolean(isNow) };
        res = await fetch(`${API_BASE}/api/Inventories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      if (!res.ok) {
        const text = await res.text();
        alert('Error al actualizar inventario: ' + text);
      }
      fetchInventories();
    } catch (e) {
      alert('Error de red al actualizar inventario.');
    }
  };

  const openEdit = (roomId, date) => {
    const entry = (data[String(roomId)] || {})[date];
    const initial = entry ? { id: entry.id, roomTypeId: Number(roomId), date, status: entry.status, needsCleaning: Boolean(entry.needsCleaning) } : { roomTypeId: Number(roomId), date };
    setEditingInitial(initial);
    setModalOpen(true);
  };

  return (
    <section>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Inventario</h1>
      <p className="text-slate-500 mb-8">Monitorea la disponibilidad y ocupación de habitaciones por fecha.</p>

      <div style={{display: 'flex', gap: 24, alignItems: 'stretch', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 6}} className="mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card" style={{flex: '0 0 260px', display: 'flex', alignItems: 'center'}}>
            <div className={`metric-icon ${m.color}`}>{m.icon}</div>
            <div>
              <div className="metric-value">{m.value ?? '—'}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10">
          <div className="card">
          <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center', marginBottom: '0.5rem'}}>
              <button className="btn btn-primary" onClick={() => { setEditingInitial(null); setModalOpen(true); }}>+ Nuevo registro</button>
            </div>
              <div>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                  {(rooms || []).map(r => (
                    <div key={r.id} className="card" style={{ padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{r.name}</div>
                          <div className="text-slate-500 text-sm">{hotelsMap[String(r.hotelId)] ?? ('Hotel ' + r.hotelId)}</div>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>ID {r.id}</div>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        {dates.length === 0 ? (
                          <div className="text-slate-500 text-sm">Sin fechas</div>
                        ) : (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {dates.map(d => {
                              const entry = (data[String(r.id)] || {})[d];
                              const status = entry ? entry.status : 'sin registro';
                              const needsCleaning = entry ? entry.needsCleaning : false;
                              return (
                                <div key={d} style={{ borderRadius: 8, padding: 8, minWidth: 110, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  <div style={{ fontSize: 12, color: '#475569' }}>{d}</div>
                                  <div style={{ fontWeight: 700, color: status === 'agotado' ? '#b91c1c' : status === 'pocas' ? '#b45309' : '#065f46' }}>{status}</div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: 12, color: '#475569' }}>
                                      <input type="checkbox" checked={needsCleaning} onChange={() => toggleCleaning(r.id, d)} /> {" "}Limpieza
                                    </label>
                                    <button className="btn btn-ghost compact" onClick={() => openEdit(r.id, d)}>Editar</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingInitial(null); }}>
        <h2 className="text-xl font-bold mb-4">Registrar inventario</h2>
        <InventoryForm initialData={editingInitial} onSubmit={(d) => { handleCreate(d); setEditingInitial(null); }} onCancel={() => { setModalOpen(false); setEditingInitial(null); }} roomOptions={roomTypes} />
      </Modal>
    </section>
  );
}
