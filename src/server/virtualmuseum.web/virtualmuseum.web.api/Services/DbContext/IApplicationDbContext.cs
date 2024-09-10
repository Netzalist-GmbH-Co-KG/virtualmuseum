using Microsoft.EntityFrameworkCore;
using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Services;

public interface IApplicationDbContext
{
    // User Management
    DbSet<UserRole> UserRoles { get; set; }

    // Inventory
    DbSet<Tenant> Tenants { get; set; }
    DbSet<Room> Rooms { get; set; } 
    DbSet<InventoryItem> InventoryItems { get; set; }
    DbSet<TopographicalTable> TopographicalTables { get; set; }
    DbSet<TopographicalTableTimeSeries> TopographicalTableGeoEventGroups { get; set; } 
        
    // TimeSeries
    DbSet<TimeSeries> TimeSeries { get; set; }
    DbSet<GeoEventGroup> GeoEventGroups { get; set; }
    DbSet<GeoEvent> GeoEvents { get; set; }
        
    // Media
    DbSet<MultimediaPresentation> MultimediaPresentations { get; set; } 
    DbSet<PresentationItem> PresentationItems { get; set; } 
    DbSet<MediaFile> MediaFiles { get; set; } 
}