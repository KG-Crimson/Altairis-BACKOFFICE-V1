// BookingForm.js
"use client";
import { useEffect, useState, useRef } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

  

export default function BookingForm({ onSubmit, initialData = null, onCancel, hotelOptions = [], roomTypeOptions = [] }) {
  const [guestName, setGuestName] = useState((initialData && initialData.guestName) || "");
  const [checkIn, setCheckIn] = useState((initialData && initialData.checkIn) || "");
  const [checkOut, setCheckOut] = useState((initialData && initialData.checkOut) || "");
  const [checkInTime, setCheckInTime] = useState((initialData && initialData.checkInTime) || "");
  const [checkOutTime, setCheckOutTime] = useState((initialData && initialData.checkOutTime) || "");
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const handleDateKeyDown = (e) => {
    const allowed = ['Tab','Shift','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Backspace','Delete'];
    if (allowed.includes(e.key)) return;
    if (e.key.length === 1) e.preventDefault();
  };
  const checkInTimeRef = useRef(null);
  const checkOutTimeRef = useRef(null);
  const handleTimeKeyDown = (e) => {
    const allowed = ['Tab','Shift','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Backspace','Delete',':'];
    if (allowed.includes(e.key)) return;
    if (e.key.length === 1) e.preventDefault();
  };
  const [hotelId, setHotelId] = useState((initialData && initialData.hotelId) || "");
  const [roomTypeId, setRoomTypeId] = useState((initialData && initialData.roomTypeId) || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) return;
    setGuestName(initialData.guestName || "");
    if (initialData.checkIn) {
      const partsIn = String(initialData.checkIn).split("T");
      setCheckIn(partsIn[0] || initialData.checkIn || "");
      setCheckInTime(partsIn[1] ? partsIn[1].slice(0,5) : (initialData.checkInTime || ""));
    } else {
      setCheckIn(initialData.checkIn || "");
      setCheckInTime(initialData.checkInTime || "");
    }
    if (initialData.checkOut) {
      const partsOut = String(initialData.checkOut).split("T");
      setCheckOut(partsOut[0] || initialData.checkOut || "");
      setCheckOutTime(partsOut[1] ? partsOut[1].slice(0,5) : (initialData.checkOutTime || ""));
    } else {
      setCheckOut(initialData.checkOut || "");
      setCheckOutTime(initialData.checkOutTime || "");
    }
    setHotelId(initialData.hotelId || "");
    setRoomTypeId(initialData.roomTypeId || "");
  }, [initialData && initialData.id]);

  const validate = () => {
    const newErrors = {};
    if (!guestName.trim() || guestName.length < 3) newErrors.guestName = "El nombre debe tener al menos 3 caracteres.";
    if (!checkIn) newErrors.checkIn = "La fecha de check-in es obligatoria.";
    if (!checkOut) newErrors.checkOut = "La fecha de check-out es obligatoria.";
    try {
      const inDT = new Date(checkIn + (checkInTime ? `T${checkInTime}` : "T00:00"));
      const outDT = new Date(checkOut + (checkOutTime ? `T${checkOutTime}` : "T00:00"));
      if (inDT.toString() === 'Invalid Date' || outDT.toString() === 'Invalid Date') {
        newErrors.checkOut = "Fechas u horas inválidas.";
      } else if (inDT >= outDT) {
        newErrors.checkOut = "El check-out debe ser posterior al check-in.";
      }
    } catch (e) {
      newErrors.checkOut = "Error validando fechas.";
    }
    if (!hotelId) newErrors.hotelId = "El Hotel ID es obligatorio.";
    if (!roomTypeId) newErrors.roomTypeId = "El Tipo de habitación ID es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const hotelObj = (hotelOptions || []).find(h => String(h.id) === String(hotelId));
    const roomObj = (roomTypeOptions || []).find(r => String(r.id) === String(roomTypeId));
    const hotelName = hotelObj ? (hotelObj.name ?? hotelObj.title ?? String(hotelObj.id)) : undefined;
    const roomTypeName = roomObj ? (roomObj.name ?? roomObj.title ?? String(roomObj.id)) : undefined;
    const checkInDateTime = checkIn ? (checkInTime ? new Date(checkIn + `T${checkInTime}`) : new Date(checkIn + 'T00:00')) : null;
    const checkOutDateTime = checkOut ? (checkOutTime ? new Date(checkOut + `T${checkOutTime}`) : new Date(checkOut + 'T00:00')) : null;
    const payload = {
      guestName,
      checkIn: checkInDateTime ? checkInDateTime.toISOString() : null,
      checkOut: checkOutDateTime ? checkOutDateTime.toISOString() : null,
      hotelId: Number(hotelId),
      roomTypeId: Number(roomTypeId),
      status: 'confirmed'
    };
    const isEditing = initialData && initialData.id;
    (async () => {
      try {
        const url = isEditing ? `${API_BASE}/api/Bookings/${initialData.id}` : `${API_BASE}/api/Bookings`;
        const method = isEditing ? 'PUT' : 'POST';
        const body = isEditing ? { id: initialData.id, ...payload } : payload;
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const txt = await res.text();
          alert('Error creando/actualizando reserva: ' + txt);
          return;
        }
        const data = await res.json();
        alert(isEditing ? 'Reserva actualizada' : 'Reserva creada');
        onSubmit?.(data);
      } catch (err) {
        alert('Error de red creando/actualizando reserva');
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre del huésped</label>
        <input
          className={`filter-input ${errors.guestName ? 'border-red-400' : ''}`}
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />
        {errors.guestName && <div className="text-red-500 text-xs mt-1">{errors.guestName}</div>}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Check-in</label>
          <div className="flex gap-2">
            <input
              ref={checkInRef}
              type="date"
              title="Selecciona fecha"
              className={`filter-input ${errors.checkIn ? 'border-red-400' : ''}`}
              value={checkIn}
              onFocus={() => checkInRef.current?.showPicker?.()}
              onChange={(e) => setCheckIn(e.target.value)}
              onKeyDown={handleDateKeyDown}
              onPaste={(e) => e.preventDefault()}
              required
            />
            <input
              ref={checkInTimeRef}
              type="time"
              step="60"
              inputMode="numeric"
              className={`filter-input w-32 ${errors.checkIn ? 'border-red-400' : ''}`}
              value={checkInTime}
              onFocus={() => checkInTimeRef.current?.showPicker?.()}
              onChange={(e) => setCheckInTime(e.target.value)}
              onKeyDown={handleTimeKeyDown}
              onPaste={(e) => e.preventDefault()}
            />
          </div>
          {errors.checkIn && <div className="text-red-500 text-xs mt-1">{errors.checkIn}</div>}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Check-out</label>
          <div className="flex gap-2">
            <input
              ref={checkOutRef}
              type="date"
              title="Selecciona fecha"
              className={`filter-input ${errors.checkOut ? 'border-red-400' : ''}`}
              value={checkOut}
              onFocus={() => checkOutRef.current?.showPicker?.()}
              onChange={(e) => setCheckOut(e.target.value)}
              onKeyDown={handleDateKeyDown}
              onPaste={(e) => e.preventDefault()}
              required
            />
            <input
              ref={checkOutTimeRef}
              type="time"
              step="60"
              inputMode="numeric"
              className={`filter-input w-32 ${errors.checkOut ? 'border-red-400' : ''}`}
              value={checkOutTime}
              onFocus={() => checkOutTimeRef.current?.showPicker?.()}
              onChange={(e) => setCheckOutTime(e.target.value)}
              onKeyDown={handleTimeKeyDown}
              onPaste={(e) => e.preventDefault()}
            />
          </div>
          {errors.checkOut && <div className="text-red-500 text-xs mt-1">{errors.checkOut}</div>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hotel</label>
        <select
          className={`filter-input ${errors.hotelId ? 'border-red-400' : ''}`}
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          required
        >
          <option value="">Selecciona un hotel</option>
          {(hotelOptions || []).map(h => (
            <option key={h.id} value={h.id}>{h.name ?? h.title ?? h.id}</option>
          ))}
        </select>
        {(!(hotelOptions && hotelOptions.length)) && (
          <div className="text-slate-500 text-xs mt-1">Cargando hoteles... si tarda, recarga la página.</div>
        )}
        {errors.hotelId && <div className="text-red-500 text-xs mt-1">{errors.hotelId}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tipo de habitación</label>
        <select
          className={`filter-input ${errors.roomTypeId ? 'border-red-400' : ''}`}
          value={roomTypeId}
          onChange={(e) => setRoomTypeId(e.target.value)}
          required
        >
          <option value="">Selecciona un tipo</option>
          {(roomTypeOptions || []).map(r => (
            <option key={r.id} value={r.id}>{r.name ?? r.title ?? r.id}</option>
          ))}
        </select>
        {(!(roomTypeOptions && roomTypeOptions.length)) && (
          <div className="text-slate-500 text-xs mt-1">Cargando tipos de habitación... si tarda, recarga la página.</div>
        )}
        {errors.roomTypeId && <div className="text-red-500 text-xs mt-1">{errors.roomTypeId}</div>}
      </div>
      <div className="flex justify-end gap-2 mt-2">
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
          disabled={!(hotelOptions && hotelOptions.length) || !(roomTypeOptions && roomTypeOptions.length)}
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
