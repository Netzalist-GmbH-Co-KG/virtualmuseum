using System.Collections.Generic;

namespace TimeGlideVR.Server.Data
{

    /// <summary>
    /// A location time row represents a list of events
    /// that happened at a specific location at a specific time.
    /// </summary>
    public class LocationTimeRow
    {
        #nullable enable
        public string? Label { get; set; }
        public List<GeoEvent> GeoEvents { get; set; } = new();
        public List<MediaFile> MediaFiles { get; set; } = new();
    }
}