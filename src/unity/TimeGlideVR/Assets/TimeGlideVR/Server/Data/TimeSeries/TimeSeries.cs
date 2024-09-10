using System;
using System.Collections.Generic;

namespace TimeGlideVR.Server.Data.TimeRows
{
    public class TimeSeries
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    
        // ---------

        public List<GeoEventGroup> GeoEventGroups { get; set; } = new();
    }
}