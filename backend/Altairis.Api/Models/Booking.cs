using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Altairis.Api.Models
{
    public class Booking : IValidatableObject
    {
        public int Id { get; set; }

        // Nombre del huesped.
        [Required]
        [StringLength(200)]
        public string GuestName { get; set; }

        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }

        // Estado de la reserva.
        [Required]
        [StringLength(40)]
        public string Status { get; set; }

        [Range(1, int.MaxValue)]
        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }

        [Range(1, int.MaxValue)]
        public int RoomTypeId { get; set; }
        public RoomType? RoomType { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            // Validacion cruzada de fechas.
            if (CheckOut <= CheckIn)
            {
                yield return new ValidationResult(
                    "CheckOut must be after CheckIn.",
                    new[] { nameof(CheckIn), nameof(CheckOut) }
                );
            }
        }
    }
}
