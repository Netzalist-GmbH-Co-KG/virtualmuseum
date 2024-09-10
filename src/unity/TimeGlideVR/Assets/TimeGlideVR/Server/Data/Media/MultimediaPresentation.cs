using System;
using System.Collections.Generic;

namespace TimeGlideVR.Server.Data.Media
{
    public class MultimediaPresentation
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }

        // ---------
        public List<PresentationItem> PresentationItems { get; set; } = new();
    }
}