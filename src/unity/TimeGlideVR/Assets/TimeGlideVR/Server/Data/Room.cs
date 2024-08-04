﻿using System;
using System.Collections.Generic;

namespace TimeGlideVR.Server.Data
{

    /// <summary>
    /// A room defines one virtual setting within the museum.
    /// It defines which items will be loaded into the room and where they are placed.
    /// </summary>
    public class Room
    {
        public Guid Id { get; set; }
        #nullable enable
        public string? Label { get; set; }
        public string? Description { get; set; }
        public string ResourceUrl => "/api/rooms/" + Id;
        public List<MediaFile> MediaFiles { get; set; }= new();
        public List<InventoryPlacement> InventoryPlacements { get; set; } = new();
    }
}