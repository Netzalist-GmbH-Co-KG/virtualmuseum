using Microsoft.EntityFrameworkCore;
using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Services
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserRole> UserRoles { get; set; } = null!;
        public DbSet<MediaFile> MediaFiles { get; set; } = null!; 
        public DbSet<PresentationItem> PresentationItems { get; set; } = null!;
        public DbSet<MultimediaPresentation> MultimediaPresentations { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>().HasKey(ur => ur.Id);
        }
    }
}
