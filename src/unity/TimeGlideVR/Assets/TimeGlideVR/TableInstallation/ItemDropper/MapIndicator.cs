using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeGlideVR.Server;
using TimeGlideVR.Server.Data.Inventory;
using TimeGlideVR.Server.Data.Media;
using TimeGlideVR.Server.Data.TimeRows;
using TimeGlideVR.Server.WebClient;
using TimeGlideVR.TableInstallation.Table;
using TimeGlideVR.TableInstallation.Table.InfoDisplay;
using TimeGlideVR.TableInstallation.Table.MapSwitch;
using TimeGlideVR.TableInstallation.Table.Panel;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.ItemDropper
{
    public class MapIndicator : MonoBehaviour
    {
        [SerializeField] public Vector2 mapCoordinatesBottomLeft = new(51.652074717106686f, 12.655107034666422f);
        [SerializeField] public Vector2 mapCoordinatesTopRight = new(50.20243178812832f, 9.865952981932047f);
        [SerializeField] public Vector2 dropZoneSize = new(2.52f, 2.17f);

        [SerializeField] private BubblePlacer bubblePlacerReference;
        [SerializeField] private GameObject cassettePrefab;
        [SerializeField] public GameObject bubblePrefab;
        [SerializeField] public DropObject dropItemTemplate;
        [SerializeField] public float spawnHeight = 1.8f;
        [SerializeField] public float despawnHeight = -1.0f;

        [SerializeField] private int topicsToLoad = 0;

        private float _ratioWidth;
        private float _ratioHeight;

        private ButtonPanelScript _buttonPanelScript;

        private readonly Dictionary<string, List<Transform>> _spawnedItems = new();
        private TopographicalTable _tableConfiguration;
        private readonly Dictionary<string, Vector2> _cityCoordinates = new();
        private IConfigurationClient _configurationClient;
        private bool _dataLoaded;

        void Start()
        {
            try
            {
                _configurationClient = FindObjectOfType<ConfigurationManager>().ConfigurationClient;
                var realHeight = mapCoordinatesBottomLeft.x - mapCoordinatesTopRight.x;
                _ratioHeight = dropZoneSize.y / realHeight;
                var realWidth = mapCoordinatesBottomLeft.y - mapCoordinatesTopRight.y;
                _ratioWidth = dropZoneSize.x / realWidth;
                _buttonPanelScript = FindObjectOfType<ButtonPanelScript>(true);
                _buttonPanelScript.onTimeRowButtonClick.AddListener(HandleButtonClick);
                _buttonPanelScript.onDespawnAllItems.AddListener(DespawnAllItems);

                LoadConfiguration();
            }
            catch (Exception e)
            {
                Debug.Log(e.ToString());
            }
        }

        private int _currentTopicIndex = 0;
        public void StartDisplayButtonsIncremental(){
            var topic = _tableConfiguration.Topics[_currentTopicIndex];
            _currentTopicIndex = (_currentTopicIndex + 1) % _tableConfiguration.Topics.Count;
            InfoDisplay.Instance.DisplayTitle(topic.Topic);
            InfoDisplay.Instance.DisplayDescription(topic.Description);
            StartCoroutine(nameof(DisplayButtons), topic);
        }
        
        public void HideSpawnedItems()
        {
            if(_spawnedItems == null || _spawnedItems.Count == 0) return;
            foreach (var item in _spawnedItems.Values)
            {
                if(item == null || item.Count == 0) continue;
                item.ForEach(t =>
                {
                    if(t.gameObject == null) return;                    
                    t.gameObject.SetActive(false);
                });
            }
        }
        
        public void ShowSpawnedItems()
        {
            if(_spawnedItems == null || _spawnedItems.Count == 0) return;
            foreach (var item in _spawnedItems.Values)
            {
                if(item == null || item.Count == 0) continue;
                item.ForEach(t =>
                {
                    if(t.gameObject == null) return;
                    t.gameObject.SetActive(true);
                });
            }
        }
        

        // Need coroutine to get back to main thread
        private IEnumerator DisplayButtons(TopographicalTableTopic topic)
        {
            while (!_dataLoaded)
                yield return new WaitForSeconds(1);
            // Display buttons                                                                   Informationen zu Thüringen   Größte Städte ESA,ARN...
            Debug.Log(_tableConfiguration.Topics.Count);
            /*
            var allTimeSeries = _tableConfiguration.Topics.SelectMany( t => t.TimeSeries).ToList();
            var erstErwaehnung = allTimeSeries.FirstOrDefault(ts => ts.Id == new Guid("5b1ec4ab-b2d4-49b4-b05e-01f1579a233b"));
            var groessteStaedte = allTimeSeries.FirstOrDefault(ts => ts.Id == new Guid("8c472a83-e961-4bd3-b6f3-562964e322c4"));
            var infos = allTimeSeries.FirstOrDefault(ts => ts.Id == new Guid("8c472a83-e961-4bd3-b6f3-562964e32000"));
            _buttonPanelScript.Init(erstErwaehnung!.GeoEventGroups, groessteStaedte!.GeoEventGroups, infos!.GeoEventGroups);
            */
            _buttonPanelScript.DisplayTimeSeriesButtonsByTopic(topic);
            yield return null;
        }

        private async Task LoadConfiguration()
        {
            Debug.Log("Loading configuration...");
            var tenants = await _configurationClient.GetTenants();
            Debug.Log("Loaded Tenants");
            if (tenants.Count == 0)
            {
                Debug.Log("No tenants found, initializing dummy coordinates...");
                InitializeDummyCoordinates();
                return;
            }

            var firstRoom = tenants[0].Rooms.FirstOrDefault();
            Debug.Log("Loaded firstRoom");
            if (firstRoom == null)
            {
                Debug.Log("No rooms found, initializing dummy coordinates...");
                InitializeDummyCoordinates();
                return;
            }

            var firstTable = firstRoom?
                .InventoryItems.FirstOrDefault(i => i.InventoryType == InventoryType.TopographicalTable);
            Debug.Log("Loaded firstTable");

            if (firstTable == null)
            {
                Debug.Log("No tables found, initializing dummy coordinates...");
                InitializeDummyCoordinates();
                return;
            }

            _tableConfiguration = await _configurationClient.GetTopographicalTableConfiguration(firstTable.Id);
            Debug.Log("Loaded _tableConfig");
            Debug.Log($"Configuration loaded: {_tableConfiguration.Topics[topicsToLoad].TimeSeries.Count} rows");
            _dataLoaded = true;
        }

        private void InitializeDummyCoordinates()
        {
            Debug.Log("Initializing dummy coordinates...");
            _cityCoordinates.Add("Erfurt", new Vector2(50.99908816755116f, 11.033815496053597f));
            _cityCoordinates.Add("Nordhausen", new Vector2(51.49450564672544f, 10.785537710396323f));
            _cityCoordinates.Add("Weimar", new Vector2(50.97900000000001f, 11.329f));
            _cityCoordinates.Add("Jena", new Vector2(50.927f, 11.586f));
            _cityCoordinates.Add("Gotha", new Vector2(50.949f, 10.708f));
            _cityCoordinates.Add("Eisenach", new Vector2(50.976f, 10.315f));
            _cityCoordinates.Add("Ilmenau", new Vector2(50.682f, 10.918f));
            _cityCoordinates.Add("Suhl", new Vector2(50.609f, 10.690f));
            _cityCoordinates.Add("Gera", new Vector2(50.878f, 12.083f));
            _cityCoordinates.Add("Eisenberg", new Vector2(50.979f, 11.898f));
            _cityCoordinates.Add("Apolda", new Vector2(51.022f, 11.515f));
            _cityCoordinates.Add("Arnstadt", new Vector2(50.838f, 10.948f));
            _cityCoordinates.Add("Rudolstadt", new Vector2(50.717f, 11.333f));
            _cityCoordinates.Add("Saalfeld", new Vector2(50.651f, 11.366f));
            _cityCoordinates.Add("Schmalkalden", new Vector2(50.716f, 10.451f));
            _cityCoordinates.Add("Bad Salzungen", new Vector2(50.812f, 10.222f));

            _tableConfiguration.Topics = new List<TopographicalTableTopic>
            {
                new TopographicalTableTopic()
                {
                    Id = Guid.NewGuid(),
                    Topic = "Test"
                }
            };

            _tableConfiguration.Topics[topicsToLoad].TimeSeries = new List<TimeSeries>
            {
                new TimeSeries
                {
                    Id = Guid.NewGuid(),
                    Name = "Testdaten",
                    Description = "Testdaten",
                    GeoEventGroups = new List<GeoEventGroup>
                    {
                        new GeoEventGroup
                        {
                            Label = "Testdaten",
                            GeoEvents = _cityCoordinates
                                .Select(c => new GeoEvent
                                    { Name = c.Key, Latitude = c.Value.y, Longitude = c.Value.y }).ToList()
                        }
                    }
                }
            };

            _dataLoaded = true;
        }

        private void HandleButtonClick(DisplayLocationTimeRowEvent evt)
        {
            StartCoroutine(SpawnItems(evt));
        }

        private void SpawnHelper()
        {
            var media = new MediaFile
            {
                Id = Guid.NewGuid(),
                Description = "Eine kleine Beschreibung",
                Name = "Einführung in TimeglideVR",
                Type = MediaType.Video360Degree,
                Url = "https://timeglide-vr.b-cdn.net/Intro.mp4"

            };
            SpawnOrDespawnItem("Informationen",
                new Vector2(50.582299f, 10.091699f), null);
        }

        private IEnumerator SpawnItems(DisplayLocationTimeRowEvent evt)
        {
            const int batchSize = 10;
            var batchCount = 0;
            //SpawnHelper();
            foreach (var geoEvent in evt.Row.GeoEvents)
            {
                batchCount++;
                try
                {
                    /*
                    var mediaFiles = 
                        geoEvent.MultiMediaPresentation == null
                         ? new List<MediaFile>()
                         : geoEvent.MultiMediaPresentation?
                            .PresentationItems
                            .Select(pi => pi.MediaFile)
                            .ToList();
                    */
                    SpawnOrDespawnItem(geoEvent.Name,
                        new Vector2((float)geoEvent.Latitude, (float)geoEvent.Longitude), geoEvent.MultiMediaPresentation);
                }
                catch (Exception e)
                {
                    Debug.Log("Error: " + e);
                }

                if (evt.RemoveRow == false)
                {
                    yield return new WaitForSeconds(0.08f);
                }
                else
                {
                    if (batchCount % batchSize == 0)
                    {
                        yield return null;
                    }
                }
            }

            yield return null;
        }

        private Vector3 CalculateSpawnLocation(Vector2 realPosition)
        {
            var distHeight = realPosition.x - mapCoordinatesTopRight.x;
            var distWidth = realPosition.y - mapCoordinatesTopRight.y;
            var localZ = distHeight * _ratioHeight - dropZoneSize.y / 2;
            var localX = distWidth * _ratioWidth - dropZoneSize.x / 2;
            return new Vector3(localX, spawnHeight, localZ);
        }

        private void SpawnOrDespawnItem(string label, Vector2 location, MultimediaPresentation presentation, bool remove = false)
        {
            if (_spawnedItems.ContainsKey(label))
            {
                foreach (var item in _spawnedItems[label])
                {
                    if (item != null){
                        if(item.root.gameObject.CompareTag("GameController")) {
                            Destroy(item.gameObject);
                            continue;
                        }
                        Destroy(item.root.gameObject);
                    }
                }
                _spawnedItems.Remove(label);
            }
            else
            {
                if (remove) return;
                if (_spawnedItems.ContainsKey(label)) return;
                Debug.Log($"Spawning item for city: {label} at location: {location}");
                var spawnLocation = CalculateSpawnLocation(location);
                var distance = spawnLocation.z / dropZoneSize.y + 0.8f;
                var newDropObject = Instantiate(dropItemTemplate.gameObject, transform);
                var dropObject = newDropObject.GetComponent<DropObject>();
                dropObject.Init(label, null, despawnHeight, distance);
                newDropObject.transform.localPosition = spawnLocation;
                newDropObject.transform.parent = null; // this is so deleting the "root" in ClearItems or above wont delete the whole installation
                var dictList = new List<Transform> { newDropObject.transform };
                if(presentation != null) {
                    var cassetteTransform = SpawnBubbleWithCassette(presentation, label, cassettePrefab);
                    dictList.AddRange(cassetteTransform);
                }
                
                _spawnedItems.Add(label, dictList);
            }
        }

        private void DespawnAllItems()
        {
            Debug.Log("Despawning all items...");
            if (_spawnedItems == null) return;
            
            foreach (var item in _spawnedItems.Values)
            {
                if (item == null || item.Count == 0) continue;
                try
                {
                    foreach(var t in item){ // at max 2 items per city, the item with label and the bubble/cassette
                        Destroy(t.gameObject);
                    }
                }
                catch (Exception e)
                {
                    Debug.Log(e.ToString());
                }
            }
            _spawnedItems.Clear();
        }

        public List<Transform> SpawnBubbleWithCassette(MultimediaPresentation presentation, string cityName, GameObject cassettePrefab){
            var bubble = Instantiate(bubblePrefab);
            var insideBubbleReference = bubble.transform.GetChild(0).GetChild(0);
            var cas = Instantiate(cassettePrefab, insideBubbleReference.transform);
            cas.transform.localPosition = Vector3.zero;
            cas.GetComponent<Cassette>().Init(presentation, cityName);
            bubblePlacerReference.PlaceBubble(bubble.transform, cas);
            return new List<Transform> { cas.transform, bubble.transform };
        }

        public void ClearItems()
        {
            Debug.Log("Clearing items...");
            foreach (var item in _spawnedItems.Values)
            {
                if (item != null && item.Count != 0){
                    foreach(var t in item){ // at max 2 items per city, the item with label and the bubble/cassette
                        if(t.root.name == "FullInstallation") {
                            Destroy(t.gameObject);
                            continue;
                        }
                        Destroy(t.root.gameObject);
                    }
                }
            }

            _spawnedItems.Clear();
        }

        // Draw a widget in the editor which displays the drop zone as a horizontal rectangle
        // The rectangle is displayed relative to this object's transform with a height and width of dropZoneSize
        private void OnDrawGizmos()
        {
            var topLeft = transform.position + new Vector3(-dropZoneSize.x / 2, 0, dropZoneSize.y / 2);
            var topRight = transform.position + new Vector3(dropZoneSize.x / 2, 0, dropZoneSize.y / 2);
            var bottomRight = transform.position + new Vector3(dropZoneSize.x / 2, 0, -dropZoneSize.y / 2);
            var bottomLeft = transform.position + new Vector3(-dropZoneSize.x / 2, 0, -dropZoneSize.y / 2);

            Gizmos.color = Color.green;
            Gizmos.DrawLine(topLeft, topRight);
            Gizmos.DrawLine(topRight, bottomRight);
            Gizmos.DrawLine(bottomRight, bottomLeft);
            Gizmos.DrawLine(bottomLeft, topLeft);
        }
    }
}