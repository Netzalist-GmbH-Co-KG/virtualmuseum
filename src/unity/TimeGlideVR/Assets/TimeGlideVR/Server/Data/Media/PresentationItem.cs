using System;

namespace TimeGlideVR.Server.Data.Media
{
    public class PresentationItem
    {
        public Guid Id { get; set; }
        public Guid MultimediaPresentationId { get; set; }
        public Guid? MediaFileId { get; set; }
        public int SlotNumber { get; set; }
        public int SequenceNumber { get; set; }
        public int DurationInSeconds { get; set; }
    
        // ---------
        public MediaFile? MediaFile { get; set; }
    }
}