using System.Text;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Services;

public class MediaService : IMediaService
{    private readonly List<MediaFile> _mediaFiles = [];

    public MediaService()
    {
        InitializeMediaFiles();
        
    }
    public byte[] GetMedia(Guid id)
    {
        var file = _mediaFiles.FirstOrDefault(f => f.Id == id);
        if (file == null) return new byte[0];
        
        var path = Path.Combine("InputData/Media", file.FileName!);
        return File.ReadAllBytes( Path.GetFullPath(path));
    }
    
    public ActionResult GetMediaAsFile(Guid id)
    {
        var file = _mediaFiles.FirstOrDefault(f => f.Id == id);
        // throw 404 if file not found
        if (file == null) return new NotFoundResult();

        var path = Path.Combine("InputData/Media", file.FileName!);
        var mimetype = Path.GetExtension(file.FileName) switch
        {
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".mp4" => "video/mp4",
            ".webm" => "video/webm",
            ".mp3" => "audio/mpeg",
            ".wav" => "audio/wav",
            ".pdf" => "application/pdf",
            _ => "application/octet-stream"
        };
        
        return new PhysicalFileResult(Path.GetFullPath(path), mimetype);
    }
    
    private void InitializeMediaFiles()
    {
        using var file = new StreamReader("InputData/Media/MediaInventory.json", Encoding.UTF8);
        var config = JsonConvert.DeserializeObject<MediaInventory>(file.ReadToEnd());
        if (config == null) return;
        
        _mediaFiles.AddRange(config.Files);
    }
}