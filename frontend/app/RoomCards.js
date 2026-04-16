import { Pencil, Trash2 } from "lucide-react";

export default function RoomCards({ rooms = [], onEdit, onDelete }) {
  if (!rooms.length) return null;

  return (
    <div className="room-grid">
      {rooms.map((r) => (
        <div key={r.id} className="room-card">
          <div className="room-card-header">
            <div className="room-title">Habitación {r.name}</div>
            <div className="room-badge">{r.capacity} pax</div>
          </div>
          <div className="room-body">
            <div className="room-meta">Hotel: <span className="text-slate-700 font-semibold">{r.hotelName ?? r.hotelId}</span></div>
            {r.notes && <div className="text-sm text-slate-500 mt-2">{r.notes}</div>}
          </div>
          <div className="room-actions">
            <button className="icon-btn" onClick={() => onEdit && onEdit(r)} title="Editar"><Pencil size={16} /></button>
            <button className="icon-btn" onClick={() => onDelete && onDelete(r)} title="Eliminar"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
