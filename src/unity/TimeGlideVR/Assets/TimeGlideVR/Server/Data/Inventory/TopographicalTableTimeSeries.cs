using System;

namespace TimeGlideVR.Server.Data.Inventory
{
    public class TopographicalTableTimeSeries
    {
        public Guid Id { get; set; }
        public Guid TopographicalTableId { get; set; }
        public Guid TimeSeriesId { get; set; }
    }
}