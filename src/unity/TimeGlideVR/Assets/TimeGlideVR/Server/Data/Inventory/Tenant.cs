using System;
using System.Collections.Generic;

namespace TimeGlideVR.Server.Data.Inventory
{
    public class Tenant
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    
        // ---------
        public List<Room> Rooms { get; set; } = new();
    }
}