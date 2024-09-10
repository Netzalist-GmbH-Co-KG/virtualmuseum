namespace virtualmuseum.web.data;

/// <summary>
/// An Inventory Item represents any virtual object in the
/// environment of the museum as defined by its type
/// The configuration data can be obtained using the Id
/// of the Item.
/// </summary>
public class InventoryItem
{
    public Guid Id { get; set; }
    public Guid RoomId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public InventoryType InventoryType { get; set; }
    public double PositionX { get; set; } = 0;
    public double PositionY { get; set; } = 0;
    public double PositionZ { get; set; } = 0;
    public double RotationX { get; set; } = 0;
    public double RotationY { get; set; } = 0;
    public double RotationZ { get; set; } = 0;
    public double ScaleX { get; set; } = 1;
    public double ScaleY { get; set; } = 1;
    public double ScaleZ { get; set; } = 1;
}