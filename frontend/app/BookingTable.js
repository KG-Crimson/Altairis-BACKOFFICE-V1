// BookingTable.js
import { Pencil, Trash2, CalendarCheck2 } from "lucide-react";

export default function BookingTable({ bookings = [], onEdit, onDelete }) {
  if (!bookings.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <CalendarCheck2 className="w-12 h-12 text-blue-200 mb-4" />
        <div className="text-lg font-semibold text-slate-500 mb-2">No hay reservas registradas</div>
        <div className="text-slate-400">Agrega tu primera reserva</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-slate-600">Huésped</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-600">Check-in</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-600">Check-out</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-600">Hotel</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-600">Estado</th>
              <th className="text-center p-3 text-sm font-semibold text-slate-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="bg-white rounded-lg mb-3">
                <td className="p-3 font-medium text-slate-800">{b.guestName}</td>
                <td className="p-3 text-slate-500">{b.checkIn?.split('T')[0] ?? '—'}</td>
                <td className="p-3 text-slate-500">{b.checkOut?.split('T')[0] ?? '—'}</td>
                <td className="p-3 text-slate-500">{b.hotelId}</td>
                <td className="p-3">
                  {b.status ? (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${b.status.toLowerCase() === 'operativo' ? 'bg-emerald-100 text-emerald-800' : b.status.toLowerCase() === 'pendiente' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'}`}>
                      {b.status}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="text-center p-3">
                  <button
                    className="inline-flex items-center p-1 text-blue-600 hover:bg-blue-100 rounded-full mr-2"
                    onClick={() => onEdit && onEdit(b)}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="inline-flex items-center p-1 text-red-500 hover:bg-red-100 rounded-full"
                    onClick={() => onDelete && onDelete(b)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
