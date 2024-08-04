namespace TimeGlideVR.Server.Data
{


    /// <summary>
    /// An inventory placement defines where
    /// a piece of inventory is placed in the museum.
    /// how it is rotated and how it is scaled.
    /// </summary>
    public class InventoryPlacement
    {
        #nullable enable
        public InventoryItem? InventoryItem { get; set; }
        public Location? Location { get; set; }
    }
}