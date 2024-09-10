namespace virtualmuseum.web.data;

public class PresentationItem
{
    public Guid Id { get; set; }
    public Guid MultimediaPresentationId { get; set; }
    public int SlotNumber { get; set; }
    public Guid? MediaFileId { get; set; }
    public int SequenceNumber { get; set; }
    public int DurationInSeconds { get; set; }
}