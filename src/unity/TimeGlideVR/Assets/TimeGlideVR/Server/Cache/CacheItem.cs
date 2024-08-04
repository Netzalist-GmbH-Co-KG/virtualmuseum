using System;

namespace TimeGlideVR.Server.Cache
{
    public class CacheItem
    {
        public string CacheId { get; set; }
        public DateTime Expiration { get; set; }
        public string JsonData { get; set; }
    }
}