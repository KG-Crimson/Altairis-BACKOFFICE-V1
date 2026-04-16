using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Altairis.Api.Data;
using Altairis.Api.Models;

namespace Altairis.Api.Controllers
{
    [Route("api/[controller]")]
 [ApiController]
 public class BookingsController : ControllerBase
 {
    private readonly AppDbContext _context;

    public BookingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // Paginacion basica para listas grandes.
        var size = Math.Clamp(pageSize, 1, 200);
        var currentPage = Math.Max(page, 1);
        var total = await _context.Bookings.CountAsync();

        var items = await _context.Bookings
                                  .AsNoTracking()
                                  .Include(b => b.Hotel)
                                  .Include(b => b.RoomType)
                                  .OrderBy(b => b.Id)
                                  .Skip((currentPage - 1) * size)
                                  .Take(size)
                                  .ToListAsync();

        return Ok(new { items, total, page = currentPage, pageSize = size });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> GetBooking(int id)
    {
        var booking = await _context.Bookings
                                    .AsNoTracking()
                                    .Include(b => b.Hotel)
                                    .Include(b => b.RoomType)
                                    .FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null) return NotFound();
        return booking;
    }

    [HttpPost]
    public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
    {
        // Validaciones de negocio basicas.
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == booking.HotelId);
        if (!hotelExists)
        {
            return BadRequest("HotelId no existe.");
        }

        var roomType = await _context.RoomTypes
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(r => r.Id == booking.RoomTypeId);
        if (roomType == null)
        {
            return BadRequest("RoomTypeId no existe.");
        }

        if (roomType.HotelId != booking.HotelId)
        {
            return BadRequest("RoomTypeId no pertenece al HotelId.");
        }

        // Ignore navigation properties from caller to avoid EF trying to insert
        // related entities when only their Ids are intended to be used.
        booking.Hotel = null;
        booking.RoomType = null;

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(int id, Booking booking)
    {
        if (id != booking.Id) return BadRequest();

        // Revalida relaciones para evitar inconsistencias.
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == booking.HotelId);
        if (!hotelExists)
        {
            return BadRequest("HotelId no existe.");
        }

        var roomType = await _context.RoomTypes
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(r => r.Id == booking.RoomTypeId);
        if (roomType == null)
        {
            return BadRequest("RoomTypeId no existe.");
        }

        if (roomType.HotelId != booking.HotelId)
        {
            return BadRequest("RoomTypeId no pertenece al HotelId.");
        }

        // Ignore navigation properties to avoid accidental inserts/updates
        booking.Hotel = null;
        booking.RoomType = null;

        _context.Entry(booking).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Bookings.Any(b => b.Id == id)) return NotFound();
            else throw;
        }
        var updated = await _context.Bookings
                                    .AsNoTracking()
                                    .Include(b => b.Hotel)
                                    .Include(b => b.RoomType)
                                    .FirstOrDefaultAsync(b => b.Id == id);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return NotFound();

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return NoContent();
    }
 } 
}
