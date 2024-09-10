using System.ComponentModel.DataAnnotations.Schema;

namespace virtualmuseum.web.data;

public class Tenant
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    
    // ---------
    [NotMapped]
    public List<Room> Rooms { get; set; } = [];
}