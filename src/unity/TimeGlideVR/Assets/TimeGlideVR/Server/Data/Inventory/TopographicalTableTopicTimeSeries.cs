using System;

namespace TimeGlideVR.Server.Data.Inventory
{
    public class TopographicalTableTopicTimeSeries
    {
        public Guid Id { get; set; }
        public Guid TopographicalTableTopicId { get; set; }
        public Guid TimeSeriesId { get; set; }
    }
}