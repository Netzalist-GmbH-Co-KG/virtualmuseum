using Microsoft.AspNetCore.Mvc;

namespace virtualmuseum.web.api.Services.MediaService;

public interface IMediaService
{
    byte[] GetMedia(Guid id);
    ActionResult GetMediaAsFile(Guid id);
}