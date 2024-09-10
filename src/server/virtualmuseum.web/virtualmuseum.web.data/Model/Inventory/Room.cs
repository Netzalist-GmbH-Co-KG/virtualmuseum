using System.ComponentModel.DataAnnotations.Schema;

namespace virtualmuseum.web.data;

/// <summary>
/// A room defines one virtual setting within the museum.
/// It defines which items will be loaded into the room and where they are placed.
/// </summary>
public class Room
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string? Label { get; set; }
    public string? Description { get; set; }
    
    // ---------
    [NotMapped]
    public List<InventoryItem> InventoryItems { get; set; } = [];
}