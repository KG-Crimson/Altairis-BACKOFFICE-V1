// RoomTypeForm.js
'use client';
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function RoomTypeForm({ onSubmit, initialData = null, onCancel, hotelOptions }) {
  const [name, setName] = useState((initialData && initialData.name) || "");
  const [capacity, setCapacity] = useState((initialData && initialData.capacity) || 1);
  const [hotelId, setHotelId] = useState((initialData && initialData.hotelId) || "");
  const [errors, setErrors] = useState({});
  const [hotels, setHotels] = useState(hotelOptions || []);

  useEffect(() => {
    // If no hotelOptions provided, fetch hotels from API (paginated)
    if ((!hotelOptions || hotelOptions.length === 0) && hotels.length === 0) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/Hotels?page=1&pageSize=200`);
          if (!res.ok) return;
          const data = await res.json();
          // API returns { items, total, page, pageSize }
          if (data && Array.isArray(data.items)) setHotels(data.items);
        } catch (e) {
          // ignore fetch errors; we'll show text input fallback
        }
      })();
    }
  }, [hotelOptions]);

  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name || "");
    setCapacity(initialData.capacity || 1);
    setHotelId(initialData.hotelId || "");
  }, [initialData && initialData.id]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim() || name.length < 2) newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    if (!capacity || capacity < 1) newErrors.capacity = "La capacidad debe ser mayor a 0.";
    if (!hotelId || String(hotelId).length < 1) newErrors.hotelId = "El hotel es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const hotelObj = hotels.find(h => String(h.id) === String(hotelId));
    const hotelName = hotelObj ? (hotelObj.name ?? hotelObj.title ?? String(hotelObj.id)) : hotelId;
    // Ensure hotelId is sent as a number (API expects int)
    const payload = { name, capacity: Number(capacity), hotelId: Number(hotelId), hotelName };
    (async () => {
      try {
        const isEditing = initialData && initialData.id;
        const url = isEditing ? `${API_BASE}/api/RoomTypes/${initialData.id}` : `${API_BASE}/api/RoomTypes`;
        const method = isEditing ? 'PUT' : 'POST';
        const body = isEditing ? { id: initialData.id, ...payload } : payload;
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const txt = await res.text();
          alert('Error creando/actualizando tipo de habitación: ' + txt);
          return;
        }
        const data = await res.json();
        alert(isEditing ? 'Tipo de habitación actualizado' : 'Tipo de habitación creado');
        onSubmit?.(data);
      } catch (err) {
        alert('Error de red creando/actualizando tipo de habitación');
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label className="form-label">Nombre</label>
          <input
            tabIndex={0}
            className={`filter-input ${errors.name ? 'error' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => e.currentTarget.focus()}
            required
          />
          {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
        </div>
        <div>
          <label className="form-label">Capacidad</label>
          <input
            tabIndex={0}
            type="number"
            min="1"
            className={`filter-input ${errors.capacity ? 'error' : ''}`}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            onFocus={(e) => e.currentTarget.focus()}
            required
          />
          {errors.capacity && <div className="text-red-500 text-xs mt-1">{errors.capacity}</div>}
        </div>
      </div>

      <div>
        <label className="form-label">Hotel</label>
        {hotels && hotels.length > 0 ? (
          <select tabIndex={0} className={`filter-input ${errors.hotelId ? 'error' : ''}`} value={hotelId} onChange={e => setHotelId(e.target.value)}>
            <option value="">Selecciona un hotel...</option>
            {hotels.map(h => (
              <option key={h.id} value={h.id}>{h.name ?? h.title ?? `Hotel ${h.id}`}</option>
            ))}
          </select>
        ) : (
          <input
            tabIndex={0}
            className={`filter-input ${errors.hotelId ? 'error' : ''}`}
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            onFocus={(e) => e.currentTarget.focus()}
            placeholder="ID o nombre del hotel"
          />
        )}
        {errors.hotelId && <div className="text-red-500 text-xs mt-1">{errors.hotelId}</div>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}
