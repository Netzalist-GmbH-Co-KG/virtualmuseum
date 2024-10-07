using BunnyCDN.Net.Storage;
using Microsoft.AspNetCore.Mvc;
using virtualmuseum.web.api.Services.ConfigurationRepository;

namespace virtualmuseum.web.api.Services.MediaService;

public class BunnyMediaService : IMediaService
{
    private readonly IBunnyCDNStorage _storage;
    private readonly IConfigurationRepository _configurationRepository;

    public BunnyMediaService(IBunnyCDNStorage storage, IConfigurationRepository configurationRepository)
    {
        _storage = storage;
        _configurationRepository = configurationRepository;
    }
    
    public byte[] GetMedia(string id)
    {
        var mediaFile = _configurationRepository.GetMediaFiles().FirstOrDefault(f => f.Id == id);
        if(mediaFile == null) return Array.Empty<byte>();
        
        var path = "/timeglide/" + "20240805_125652_717.jpg";
        var file = _storage.DownloadObjectAsStreamAsync(path).Result;
        using var memoryStream = new MemoryStream();
        file.CopyTo(memoryStream);
        return memoryStream.ToArray();
    }

    public ActionResult GetMediaAsFile(string id)
    {
        var mediaFile = _configurationRepository.GetMediaFiles().FirstOrDefault(f => f.Id == id);
        if(mediaFile == null) return new NotFoundResult();

        var file = _storage.DownloadObjectAsStreamAsync("/timeglide/2DBilder/" + "Meiningen%20Hexenverfolgung%20hexen_1693.jpg").Result;
        if (file == null) return new NotFoundResult();
        var mimetype = Path.GetExtension(mediaFile.FileName) switch
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
        
        return new FileStreamResult(file, mimetype);
    }
    
    public async Task UploadMediaAsync(string id, string fileName, Stream stream)
    {
        var path = "/timeglide/" + fileName;
        await _storage.UploadAsync(stream, path);
    }
}