import { Pencil, Trash2, CalendarCheck2 } from "lucide-react";

export default function BookingCards({ bookings = [], onEdit, onDelete, hotelMap = {}, roomTypeMap = {} }) {
  if (!bookings.length) return null;

  return (
    <div className="room-grid">{/* reuse grid styles */}
      {bookings.map((b) => (
        <div key={b.id} className="room-card">
          <div className="room-card-header">
            <div>
              <div className="room-title">{b.guestName}</div>
              <div className="text-sm text-slate-500">{b.checkIn?.split('T')[0] ?? '—'} → {b.checkOut?.split('T')[0] ?? '—'}</div>
            </div>
            <div className="room-badge">{b.status ?? '—'}</div>
          </div>
          <div className="room-body">
            <div className="text-sm text-slate-500">Hotel: <span className="text-slate-700 font-semibold">{b.hotelName ?? hotelMap[String(b.hotelId)] ?? b.hotelId}</span></div>
            <div className="text-sm text-slate-500">Tipo: <span className="text-slate-700 font-semibold">{b.roomTypeName ?? roomTypeMap[String(b.roomTypeId)] ?? b.roomTypeId}</span></div>
          </div>
          <div className="room-actions">
            <button className="icon-btn" onClick={() => onEdit && onEdit(b)} title="Editar"><Pencil size={16} /></button>
            <button className="icon-btn" onClick={() => onDelete && onDelete(b)} title="Eliminar"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
 
