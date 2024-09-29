using System.ComponentModel.DataAnnotations.Schema;
using virtualmuseum.web.data.Model.Media;

namespace virtualmuseum.web.data.Model.TimeSeries;

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