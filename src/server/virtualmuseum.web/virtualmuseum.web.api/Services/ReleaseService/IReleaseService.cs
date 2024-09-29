using virtualmuseum.web.api.Services.Model;

namespace virtualmuseum.web.api.Services.ReleaseService;

public interface IReleaseService
{
    Task<List<Release>> GetAllReleases();
    Task<List<Release>> Refresh();
}