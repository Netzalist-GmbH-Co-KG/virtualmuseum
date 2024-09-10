using Microsoft.EntityFrameworkCore;
using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Services;

public interface IApplicationDbContext
{
    DbSet<UserRole> UserRoles { get; set; }
    DbSet<MediaFile> MediaFiles { get; set; }
    DbSet<PresentationItem> PresentationItems { get; set; }
    DbSet<MultimediaPresentation> MultimediaPresentations { get; set; }
}