using System;
using System.ComponentModel.DataAnnotations;

namespace Altairis.Api.Models
{
    public class Inventory
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }

        // Habitaciones disponibles para la fecha.
        [Range(0, int.MaxValue)]
        public int AvailableRooms { get; set; }

        [Range(1, int.MaxValue)]
        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }

        [Range(1, int.MaxValue)]
        public int RoomTypeId { get; set; }
        public RoomType? RoomType { get; set; }

        // Indica si la habitación/tipo necesita limpieza para esa fecha.
        public bool NeedsCleaning { get; set; } = false;
    }
}
