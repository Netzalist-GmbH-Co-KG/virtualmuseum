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

        // User Management
        public DbSet<UserRole> UserRoles { get; set; } = null!;

        // Inventory
        public DbSet<Tenant> Tenants { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<InventoryItem> InventoryItems { get; set; } = null!;
        public DbSet<TopographicalTable> TopographicalTables { get; set; } = null!;
        public DbSet<TopographicalTableGeoEventGroup> TopographicalTableGeoEventGroups { get; set; } = null!;
        
        // TimeRows
        public DbSet<GeoEventGroup> GeoEventGroups { get; set; } = null!;
        public DbSet<GeoEvent> GeoEvents { get; set; } = null!;
        
        // Media
        public DbSet<MultimediaPresentation> MultimediaPresentations { get; set; } = null!;
        public DbSet<PresentationItem> PresentationItems { get; set; } = null!;
        public DbSet<MediaFile> MediaFiles { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>().HasKey(ur => ur.Id);
        }
    }
}
