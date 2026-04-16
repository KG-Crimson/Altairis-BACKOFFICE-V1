// HotelTable.js
import { Pencil, Trash2, Hotel } from "lucide-react";

export default function HotelTable({ hotels = [], onEdit, onDelete }) {
  if (!hotels.length) {
    return (
      <div className="empty-state">
        <Hotel className="" style={{ width: 56, height: 56, color: '#0b6fb0', margin: '0 auto 1rem' }} />
        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>No hay hoteles registrados</div>
        <div className="text-muted">Agrega tu primer hotel para comenzar</div>
      </div>
    );
  }

  return (
    <div className="card">
      <table className="table-modern">
        <thead>
          <tr>
            <th></th>
            <th>HOTEL NAME</th>
            <th>LOCATION</th>
            <th>STATUS</th>
            <th>ROOMS</th>
            <th style={{ textAlign: 'center' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td style={{ width: 54 }}>
                <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                  <Hotel size={18} color="rgba(255,255,255,0.9)" />
                </div>
              </td>
              <td>{hotel.name}</td>
              <td>{hotel.city}, {hotel.country}</td>
              <td>
                <span className={hotel.status === 'OPERATIVO' ? 'status-badge status-operational' : 'status-badge status-maintenance'}>
                  {hotel.status}
                </span>
              </td>
              <td>{hotel.rooms ?? '—'}</td>
              <td style={{ textAlign: 'center' }}>
                <button title="Editar" onClick={() => onEdit && onEdit(hotel)} style={{ marginRight: 8 }} className="icon-btn"><Pencil size={16} /></button>
                <button title="Eliminar" onClick={() => onDelete && onDelete(hotel)} className="icon-btn"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

