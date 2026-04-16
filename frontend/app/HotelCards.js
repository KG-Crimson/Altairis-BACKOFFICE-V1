import { Pencil, Trash2, MapPin } from "lucide-react";

export default function HotelCards({ hotels = [], onEdit, onDelete }) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <div className="hotel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
      {hotels.map(h => (
        <div key={h.id} className="card" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{h.name}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }} className="text-slate-500 text-sm">
                <MapPin size={14} /> {h.city}, {h.country}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>ID {h.id}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="icon-btn" title="Editar" onClick={() => onEdit && onEdit(h)}><Pencil size={16} /></button>
                <button className="icon-btn" title="Eliminar" onClick={() => onDelete && onDelete(h)}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
