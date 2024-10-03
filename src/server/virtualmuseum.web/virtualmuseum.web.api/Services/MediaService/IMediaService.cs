using Microsoft.AspNetCore.Mvc;

namespace virtualmuseum.web.api.Services.MediaService;

public interface IMediaService
{
    byte[] GetMedia(string id);
    ActionResult GetMediaAsFile(string id);
}