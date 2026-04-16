// HotelForm.js
'use client';
import { useState, useEffect } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";


export default function HotelForm({ onSubmit, initialData = {}, onCancel }) {
  const [name, setName] = useState(initialData?.name || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(initialData?.name || "");
    setCity(initialData?.city || "");
    setCountry(initialData?.country || "");
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim() || name.length < 3) newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    if (!city.trim() || city.length < 2) newErrors.city = "La ciudad debe tener al menos 2 caracteres.";
    if (!country.trim() || country.length < 2) newErrors.country = "El país debe tener al menos 2 caracteres.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { name, city, country };
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/Hotels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const txt = await res.text();
          alert('Error creando hotel: ' + txt);
          return;
        }
        const data = await res.json();
        alert('Hotel creado');
        onSubmit?.(data);
      } catch (err) {
        alert('Error de red creando hotel');
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="hotel-form">
      <div className="hotel-form-grid">
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input
            className={`filter-input ${errors.name ? 'error' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Ciudad</label>
          <input
            className={`filter-input ${errors.city ? 'error' : ''}`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">País</label>
          <input
            className={`filter-input ${errors.country ? 'error' : ''}`}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          {errors.country && <div className="text-red-500 text-xs mt-1">{errors.country}</div>}
        </div>
      </div>

      <div className="hotel-form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}
