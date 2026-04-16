// InventoryMatrix.js
import React from "react";



export default function InventoryMatrix({ rooms = [], dates = [], data = {} }) {
  if (!rooms.length || !dates.length) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 text-center text-sm text-slate-500">
        No hay datos de inventario. Agrega registros usando Nuevo registro.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-2 border border-slate-100 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 text-sm font-semibold text-slate-600">Habitación</th>
            {dates.map((date) => (
              <th key={date} className="text-center p-3 whitespace-nowrap text-sm text-slate-600">{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="bg-white rounded-lg mb-3">
              <td className="p-3 font-medium text-slate-700">{room.name}</td>
              {dates.map((date) => {
                const cell = data[room.id]?.[date];
                if (!cell) return <td key={date} className="text-center p-3">—</td>;
                const status = typeof cell === 'string' ? cell : cell.status;
                const needsCleaning = typeof cell === 'object' ? cell.needsCleaning : false;
                const label = status.charAt(0).toUpperCase() + status.slice(1);
                return (
                  <td key={date} className="text-center p-3 flex flex-col items-center gap-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status === 'pocas' ? 'bg-amber-100 text-amber-800' : status === 'agotado' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>{label}</span>
                    {needsCleaning && <span className="text-xs text-slate-500">🧹 limpieza</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
