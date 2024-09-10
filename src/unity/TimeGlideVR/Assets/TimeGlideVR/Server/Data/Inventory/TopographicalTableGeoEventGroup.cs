using System;

namespace TimeGlideVR.Server.Data.Inventory
{
    public class TopographicalTableGeoEventGroup
    {
        public Guid Id { get; set; }
        public Guid TopographicalTableId { get; set; }
        public Guid GeoEventGroupId { get; set; }
    }
}