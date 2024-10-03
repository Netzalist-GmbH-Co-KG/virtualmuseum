using Microsoft.EntityFrameworkCore;
using virtualmuseum.web.api.Services.Admin;
using virtualmuseum.web.data.Model.Inventory;
using virtualmuseum.web.data.Model.Media;
using virtualmuseum.web.data.Model.TimeSeries;

namespace virtualmuseum.web.api.Services.DbContext
{
    public class ApplicationDbContext : Microsoft.EntityFrameworkCore.DbContext, IApplicationDbContext
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
        public DbSet<TopographicalTableTopic> TopographicalTableTopics { get; set; } = null!;
        public DbSet<TopographicalTableTopicTimeSeries> TopographicalTableTopicTimeSeries { get; set; } = null!;
        
        // TimeSeries
        public DbSet<TimeSeries> TimeSeries { get; set; } = null!;
        public DbSet<GeoEventGroup> GeoEventGroups { get; set; } = null!;
        public DbSet<GeoEvent> GeoEvents { get; set; } = null!;
        
        // Media
        public DbSet<MultimediaPresentation> MultimediaPresentations { get; set; } = null!;
        public DbSet<PresentationItem> PresentationItems { get; set; } = null!;
        public DbSet<MediaFile> MediaFiles { get; set; } = null!;
        public void SaveAllChanges()
        {
            SaveChanges();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>().HasKey(ur => ur.Id);
        }
    }
}
