using Microsoft.AspNetCore.Mvc;
using virtualmuseum.web.api.Services;
using virtualmuseum.web.api.Services.MediaService;

namespace virtualmuseum.web.api.Api;

[ApiController]
[Route("api")]
public class MediaController
{
    private readonly IMediaService _mediaService;

    public MediaController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }
    [HttpGet("media/{id}")]
    public byte[] Get(string id)
    {
        return _mediaService.GetMedia(id);
    }
    
    // Return file as a mime type
    [HttpGet("media/fileold/{id}")]
    public ActionResult GetDisplay(string id)
    {
        return _mediaService.GetMediaAsFile(id);
    }
}