namespace virtualmuseum.web.data;

public class GeoEvent
{
    public Guid Id { get; set; }
    public int Year { get; set; }
    public string? Label { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public Guid? MultimediaPresentationId { get; set; }
}