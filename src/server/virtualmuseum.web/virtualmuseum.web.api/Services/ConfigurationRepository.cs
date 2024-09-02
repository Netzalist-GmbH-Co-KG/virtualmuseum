using System.Reflection;
using System.Text;
using Newtonsoft.Json;
using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Services;

public class ConfigurationRepository : IConfigurationRepository
{
    private readonly IApplicationDbContext _applicationDbContext;

    // private readonly Guid _dummyRoomId = Guid.Parse("00000000-0000-0000-0000-000000000000");
    // private readonly Guid _dummyTableId = Guid.Parse("00000000-0000-0000-0000-000000000001");
    private readonly List<Room> _rooms = [];
    private readonly Dictionary<Guid, TopographicalTableConfiguration> _tableConfigurations = new();
    private readonly List<MediaFile> _mediaFiles = [];

    public ConfigurationRepository(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
        InitializeMediaFiles();
        InitializeTableConfigurations();
        InitializeRooms();
    }

    public List<Room> GetAllRooms() => _rooms.Select(r => new Room
    {
        Id = r.Id,
        Label = r.Label,
        Description = r.Description,
        InventoryPlacements = [],
    }).ToList();

    public List<MultimediaPresentation> GetAllMultimediaPresentations()
    {
        return _applicationDbContext
            .MultimediaPresentations
            .ToList();
    }

    public List<PresentationItem> GetAllPresentationItems(Guid multimediaPresentationId)
    {
        return _applicationDbContext
            .PresentationItems
            .ToList()
            .Where(i => i.MultimediaPresentationId == multimediaPresentationId)
            .ToList();

    }

    public Room GetRoom(Guid id) => _rooms.First(r => r.Id == id);
    public TopographicalTableConfiguration GetTopographicalTableConfiguration(Guid id) => _tableConfigurations[id];

    private void InitializeRooms()
    {
        using var file = new StreamReader("InputData/Config/Wilhelmsburg.json", Encoding.UTF8);
        var config = JsonConvert.DeserializeObject<Tenant>(file.ReadToEnd());
        if (config == null) return;
        _rooms.AddRange(config.Rooms);
    }

    private void InitializeTableConfigurations()
    {

    }
    
    private void InitializeMediaFiles()
    {
        using var file = new StreamReader("InputData//Media/MediaInventory.json", Encoding.UTF8);
        var config = JsonConvert.DeserializeObject<MediaInventory>(file.ReadToEnd());
        if (config == null) return;
        
        _mediaFiles.AddRange(config.Files);
    }

    // private List<LocationTimeRow> GetLocationTimeRows()
    // {
    //     var dummySections = new List<int>
    //     {
    //         704, 774, 785, 786, 799, 810, 839, 860, 874
    //     };
    //     var geoEvents = ReadCsv("InputData/MuseumGPS.csv");
    //     var locationTimeRows = new List<LocationTimeRow>();
    //     for (var i = 0; i < dummySections.Count - 1; i++)
    //     {
    //         var yearStart = dummySections[i];
    //         var yearEnd = dummySections[i + 1];
    //         var geoEventsInRange = geoEvents.Where(geoEvent => geoEvent.Year >= yearStart && geoEvent.Year < yearEnd)
    //             .ToList();
    //         var locationTimeRow = new LocationTimeRow
    //         {
    //             Label = $"From {yearStart} to {yearEnd} ({geoEventsInRange.Count} events)",
    //             GeoEvents = geoEventsInRange,
    //         };
    //         locationTimeRows.Add(locationTimeRow);
    //     }
    //
    //     return locationTimeRows;
    // }

    // private static List<GeoEvent> ReadCsv(string filePath)
    // {
    //     var geoEvents = new List<GeoEvent>();
    //
    //     var file = new StreamReader(filePath, Encoding.UTF8);
    //     while (!file.EndOfStream)
    //     {
    //         var line = file.ReadLine();
    //         if (line == null) continue;
    //         var parts = line.Split(';');
    //         var location = parts[3].Split(',');
    //
    //         var geoEvent = new GeoEvent
    //         {
    //             Year = int.Parse(parts[0]),
    //             Label = parts[1],
    //             Latitude = double.Parse(location[0], CultureInfo.InvariantCulture),
    //             Longitude = double.Parse(location[1], CultureInfo.InvariantCulture),
    //             MediaFiles =
    //             [
    //                 new MediaFile
    //                 {
    //                     Id = Guid.Empty, Type = "JPG", Description = "Just a test", Name = "Test Image",
    //                     Url = $"/api/media/{Guid.Empty}/display"
    //                 }
    //             ]
    //         };
    //
    //         geoEvents.Add(geoEvent);
    //     }
    //
    //     return geoEvents;
    // }
}