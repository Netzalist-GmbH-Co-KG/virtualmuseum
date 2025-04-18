﻿using System.Linq.Dynamic.Core;
using virtualmuseum.web.api.Services.DbContext;
using virtualmuseum.web.data;
using virtualmuseum.web.data.Model.Inventory;
using virtualmuseum.web.data.Model.Media;
using virtualmuseum.web.data.Model.TimeSeries;

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

    public List<MediaFile> GetMediaFiles()
    {
        return _applicationDbContext.MediaFiles
            .ToList();
    }

    public List<MultimediaPresentation> GetMultiMediaPresentation()
    {
        return _applicationDbContext.MultimediaPresentations
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

        table.Topics = _applicationDbContext.TopographicalTableTopics.ToList()
            .Where(g => g.TopographicalTableId.ToString() == topographicalTableId.ToString())
            .ToList();

        foreach (var topic in table.Topics)
        {
            var timeSeriesMap = _applicationDbContext.TopographicalTableTopicTimeSeries
                .Where(ts => ts.TopographicalTableTopicId.ToString() == topic.Id.ToString())
                .ToList();
            var timeSeries = _applicationDbContext.TimeSeries
                .AsEnumerable()
                .Where(ts => timeSeriesMap.Any(tsm => tsm.TimeSeriesId.ToString() == ts.Id.ToString()))
                .ToList();
            var fullTimeSeries = timeSeries
                .Select(GetTimeSeries)
                .ToList();
            
            topic.TimeSeries = fullTimeSeries;
        }
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

    void IConfigurationRepository.SaveMediaFile(MediaFile? mediaFile)
    {
        if (mediaFile == null) return;
        
        var existingMediaFile = _applicationDbContext.MediaFiles
            .FirstOrDefault(m => m.Id == mediaFile.Id);
        
        if (existingMediaFile == null)
        {
            mediaFile.Id = Guid.NewGuid().ToString();
            _applicationDbContext.MediaFiles.Add(mediaFile);
        }
        else
        {
            existingMediaFile.Name = mediaFile.Name;
            existingMediaFile.Description = mediaFile.Description;
            existingMediaFile.Url = mediaFile.Url;
            existingMediaFile.Type = mediaFile.Type;
            _applicationDbContext.MediaFiles.Update(existingMediaFile);
        }
        
        _applicationDbContext.SaveAllChanges();
    }

    public void SavePresentation(MultimediaPresentation? multimediaPresentation)
    {
        if (multimediaPresentation == null) return;
        
        var existingPresentation = _applicationDbContext.MultimediaPresentations
            .FirstOrDefault(p => p.Id == multimediaPresentation.Id);
        
        if (existingPresentation == null)
        {
            multimediaPresentation.Id = Guid.NewGuid();
            _applicationDbContext.MultimediaPresentations.Add(multimediaPresentation);
        }
        else
        {
            existingPresentation.Name = multimediaPresentation.Name;
            existingPresentation.Description = multimediaPresentation.Description;
            _applicationDbContext.MultimediaPresentations.Update(existingPresentation);
        }
        
        _applicationDbContext.SaveAllChanges();
    }

    private PresentationItem GetPresentationItem(PresentationItem item)
    {
        item.MediaFile = _applicationDbContext.MediaFiles
            .FirstOrDefault(m => item.MediaFileId.ToString() == m.Id.ToString());
        
        return item;
    }
}