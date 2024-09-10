using System.ComponentModel.DataAnnotations.Schema;

namespace virtualmuseum.web.data;

public class TimeSeries
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    
    // ---------
    [NotMapped]
    public List<GeoEventGroup> GeoEventGroups { get; set; } = [];
}