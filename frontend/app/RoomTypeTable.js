// RoomTypeTable.js
import { Pencil, Trash2, BedDouble } from "lucide-react";

export default function RoomTypeTable({ roomTypes = [], onEdit, onDelete }) {
  if (!roomTypes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <BedDouble className="w-12 h-12 text-blue-200 mb-4" />
        <div className="text-lg font-semibold text-slate-500 mb-2">No hay habitaciones registradas</div>
        <div className="text-slate-400">Agrega tu primer tipo de habitación</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-slate-600">Nombre</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-600">Capacidad</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-600">Hotel</th>
              <th className="text-center p-3 text-sm font-semibold text-slate-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((room) => (
              <tr key={room.id} className="bg-white rounded-lg mb-3">
                <td className="p-3 font-medium">{room.name}</td>
                <td className="p-3 text-slate-500">{room.capacity}</td>
                <td className="p-3 text-slate-500">{room.hotelId}</td>
                <td className="text-center p-3">
                  <button
                    className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-100 rounded-full mr-2"
                    onClick={() => onEdit && onEdit(room)}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="inline-flex items-center p-2 text-red-500 hover:bg-red-100 rounded-full"
                    onClick={() => onDelete && onDelete(room)}
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
