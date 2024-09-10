using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Services;

public class MediaInventory
{
    public List<MediaFile> Files { get; set; } = new();
}