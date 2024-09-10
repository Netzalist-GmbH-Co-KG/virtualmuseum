using System;
using TimeGlideVR.Server.Data.Media;

namespace TimeGlideVR.Server.Data.TimeRows
{
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
        public MultimediaPresentation? MultiMediaPresentation { get; set; }
    }
}