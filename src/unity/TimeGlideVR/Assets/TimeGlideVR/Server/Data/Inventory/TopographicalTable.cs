using System;
using System.Collections.Generic;

namespace TimeGlideVR.Server.Data.Inventory
{
    /// <summary>
    /// The configuration of a virtual topographical table
    /// The table has a label and a list of TimeSeries
    /// which can be selected by the user.
    /// </summary>
    public class TopographicalTable
    {
        public Guid Id { get; set; }

        public List<TopographicalTableTopic> Topics { get; set; } = new();
    }
}