using System;
using System.Collections.Generic;

namespace TimeGlideVR.Server.Data
{

    /// <summary>
    /// The configuration of a virtual topographical table
    /// The table has a label and a list of LocationTimeRows
    /// which can be selected by the user.
    /// </summary>
    public class TopographicalTableConfiguration
    {
        public Guid Id { get; set; }
        #nullable enable
        public string? Label { get; set; }
        public List<LocationTimeRow> LocationTimeRows { get; set; } = new();
    }
}