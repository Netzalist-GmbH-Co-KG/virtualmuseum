using System.Text;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using virtualmuseum.web.data.Model.Media;

namespace virtualmuseum.web.api.Services.MediaService;

public class MediaService : IMediaService
{ 
    private string _mediaPath;
    public MediaService()
    {
        _mediaPath = Environment.GetEnvironmentVariable("MediaPath") ?? throw new ApplicationException("MediaPath enivronment variable missing");
    }

    public byte[] GetMedia(string id)
    {

        var fileName = Path.Combine(_mediaPath, id);
        // throw 404 if file not found
        return !File.Exists(fileName) 
            ? Array.Empty<byte>() 
            : File.ReadAllBytes( Path.GetFullPath(fileName));
    }
    
    public ActionResult GetMediaAsFile(string id)
    {
        var fileName = Path.Combine(_mediaPath, id);
        // throw 404 if file not found
        if (!File.Exists(fileName)) return new NotFoundResult();

        var mimetype = Path.GetExtension(fileName) switch
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

        return new PhysicalFileResult(fileName, mimetype) { EnableRangeProcessing = true };
    }

}