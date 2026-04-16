// InventoryForm.js
'use client';
import { useState } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function InventoryForm({ onSubmit, initialData = {}, onCancel, roomOptions = [] }) {
  const [roomId, setRoomId] = useState(initialData.roomTypeId || initialData.roomId || "");
  const [date, setDate] = useState(initialData.date || "");
  const [status, setStatus] = useState(initialData.status || "disponible");
  const [needsCleaning, setNeedsCleaning] = useState(Boolean(initialData.needsCleaning));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!roomId) newErrors.roomId = "La habitación es obligatoria.";
    if (!date) newErrors.date = "La fecha es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      roomTypeId: Number(roomId) || undefined,
      hotelId: (roomOptions.find(r => String(r.id) === String(roomId)) || {}).hotelId || 1,
      date: date,
      availableRooms: status === 'agotado' ? 0 : status === 'pocas' ? 2 : 10,
      needsCleaning: Boolean(needsCleaning)
    };
    (async () => {
      try {
        const isEditing = initialData && initialData.id;
        const url = isEditing ? `${API_BASE}/api/Inventories/${initialData.id}` : `${API_BASE}/api/Inventories`;
        const method = isEditing ? 'PUT' : 'POST';
        const body = isEditing ? { id: initialData.id, ...payload } : payload;
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const txt = await res.text();
          alert('Error creando/actualizando inventario: ' + txt);
          return;
        }
        const data = await res.json();
        alert(isEditing ? 'Inventario actualizado' : 'Inventario creado');
        onSubmit?.(data);
      } catch (err) {
        alert('Error de red creando/actualizando inventario');
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="form-label">Habitación</label>
        <select
          className={`filter-input ${errors.roomId ? 'border-red-400' : ''}`}
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        >
          <option value="">Selecciona una habitación</option>
          {(roomOptions || []).map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        {errors.roomId && <div className="text-red-500 text-xs mt-1">{errors.roomId}</div>}
      </div>
      <div>
        <label className="form-label">Fecha</label>
        <input
          type="date"
          className={`filter-input ${errors.date ? 'border-red-400' : ''}`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
      </div>
      <div>
        <label className="form-label">Estado</label>
        <select
          className="filter-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="disponible">Disponible</option>
          <option value="pocas">Pocas</option>
          <option value="agotado">Agotado</option>
        </select>
      </div>
      <div>
        <label className="form-label inline-flex items-center gap-2">
          <input type="checkbox" checked={needsCleaning} onChange={(e) => setNeedsCleaning(e.target.checked)} />
          Necesita limpieza
        </label>
      </div>
      <div className="hotel-form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
