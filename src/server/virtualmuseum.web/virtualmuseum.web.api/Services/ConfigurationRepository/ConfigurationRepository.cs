using System.Linq.Dynamic.Core;
using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Services.ConfigurationRepository;

public class ConfigurationRepository : IConfigurationRepository
{
    private readonly IApplicationDbContext _applicationDbContext;

    public ConfigurationRepository(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    public List<MultimediaPresentation> GetAllMultimediaPresentations()
    {
        return _applicationDbContext
            .MultimediaPresentations
            .Select(p => new MultimediaPresentation
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                PresentationItems = _applicationDbContext.PresentationItems
                    .Where(item => item.MultimediaPresentationId == p.Id)
                    .ToList()
            })
            .ToList();
    }

    // TENANTS
    public List<Tenant> GetTenants()
    {
        return _applicationDbContext.Tenants
            .ToList()
            .Select(GetTenant)
            .ToList();
    }
    
    private Tenant GetTenant(Tenant tenant)
    {
        tenant.Rooms = _applicationDbContext.Rooms
            .Where(r => r.TenantId.ToString() == tenant.Id.ToString())
            .Select(r=>r.Id)
            .ToList()
            .Select(GetRoom)
            .ToList();
        
        return tenant;
    }
    
    private Room GetRoom(Guid roomId)
    {
        var room = _applicationDbContext.Rooms
            .FirstOrDefault(r => r.Id.ToString() == roomId.ToString());
        if (room == null) throw new FileNotFoundException();
        
        room.InventoryItems = _applicationDbContext.InventoryItems
            .Where(item => item.RoomId.ToString() == roomId.ToString())
            .ToList();
        return room;
    }

    public TopographicalTable GetTopographicalTableConfiguration(Guid topographicalTableId)
    {
        var table = _applicationDbContext.TopographicalTables
            .FirstOrDefault(t => t.Id.ToString() == topographicalTableId.ToString());
        if (table == null) throw new FileNotFoundException();
        
        var tableTimeSeries = _applicationDbContext.TopographicalTableGeoEventGroups
            .Where(g => g.TopographicalTableId.ToString() == topographicalTableId.ToString())
            .ToList();

        var timeSeries = _applicationDbContext.TimeSeries
            .Where(ts => tableTimeSeries
                .Select(tgeg => tgeg.TimeSeriesId.ToString())
                .Contains(ts.Id.ToString()))
            .ToList();
        
        var fullTimeSeries = timeSeries
            .Select(GetTimeSeries)
            .ToList();
        
        table.TimeSeries = fullTimeSeries;
        
        return table;
    }

    private TimeSeries GetTimeSeries(TimeSeries timeSeries)
    {
        timeSeries.GeoEventGroups = _applicationDbContext.GeoEventGroups
            .Where(geg => geg.TimeSeriesId.ToString() == timeSeries.Id.ToString())
            .ToList()
            .Select(GetGeoEvents)
            .ToList();
        return timeSeries;
    }

    private GeoEventGroup GetGeoEvents(GeoEventGroup geoEventGroup)
    {
        geoEventGroup.GeoEvents = _applicationDbContext.GeoEvents
            .Where(ge => ge.GeoEventGroupId.ToString() == geoEventGroup.Id.ToString())
            .ToList();

        foreach (var geoEvent in geoEventGroup.GeoEvents.Where(g=>g.MultiMediaPresentationId!=null))
        {
            geoEvent.MultiMediaPresentation = GetMultiMediaPresentation(geoEvent.MultiMediaPresentationId!.Value);
        }
        
        return geoEventGroup;
    }
    
    public MultimediaPresentation GetMultiMediaPresentation(Guid multimediaPresentationId)
    {
        var presentation = _applicationDbContext.MultimediaPresentations
            .FirstOrDefault(p => p.Id.ToString() == multimediaPresentationId.ToString());
        if (presentation == null) throw new FileNotFoundException();
        
        presentation.PresentationItems = _applicationDbContext.PresentationItems
            .Where(item => item.MultimediaPresentationId.ToString() == multimediaPresentationId.ToString())
            .ToList()
            .Select(GetPresentationItem)
            .ToList();
        
        return presentation;
    }
    
    private PresentationItem GetPresentationItem(PresentationItem item)
    {
        item.MediaFile = _applicationDbContext.MediaFiles
            .FirstOrDefault(m => item.MediaFileId.ToString() == m.Id.ToString());
        
        return item;
    }
}