using System.ComponentModel.DataAnnotations.Schema;

namespace virtualmuseum.web.data;

public class GeoEvent
{
    public Guid Id { get; set; }
    public Guid? GeoEventGroupId { get; set; }
    public Guid? MultiMediaPresentationId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public DateTime DateTime { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    // ---------
    [NotMapped]
    public MultimediaPresentation? MultiMediaPresentation { get; set; }
}