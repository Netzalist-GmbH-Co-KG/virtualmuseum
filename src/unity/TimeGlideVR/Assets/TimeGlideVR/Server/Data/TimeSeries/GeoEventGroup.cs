using System;
using System.Collections.Generic;

namespace TimeGlideVR.Server.Data.TimeRows
{
    /// <summary>
    /// A location time row represents a list of events
    /// that happened at a specific location at a specific time.
    /// </summary>
    public class GeoEventGroup
    {
        public Guid Id { get; set; }
        public Guid TimeSeriesId { get; set; }
        public string? Label { get; set; }
        public string? Description { get; set; }

        // ---------
        public List<GeoEvent> GeoEvents { get; set; } = new();
    }
}