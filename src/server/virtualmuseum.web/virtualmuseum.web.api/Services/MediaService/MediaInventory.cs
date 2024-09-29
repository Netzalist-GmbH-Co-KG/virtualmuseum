using virtualmuseum.web.data.Model.Media;

namespace virtualmuseum.web.api.Services.MediaService;

public class MediaInventory
{
    public List<MediaFile> Files { get; set; } = new();
}