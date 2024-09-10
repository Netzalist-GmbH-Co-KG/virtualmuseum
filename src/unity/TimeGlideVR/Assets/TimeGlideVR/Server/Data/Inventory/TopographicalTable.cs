using System;
using System.Collections.Generic;
using TimeGlideVR.Server.Data.TimeRows;

namespace TimeGlideVR.Server.Data.Inventory
{
    /// <summary>
    /// The configuration of a virtual topographical table
    /// The table has a label and a list of GeoEventGroups
    /// which can be selected by the user.
    /// </summary>
    public class TopographicalTable
    {
        public Guid Id { get; set; }
        public List<TimeSeries> TimeSeries { get; set; } = new();
    }
}