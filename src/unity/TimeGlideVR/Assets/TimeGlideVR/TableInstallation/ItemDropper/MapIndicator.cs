using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeGlideVR.Debugging;
using TimeGlideVR.Server;
using TimeGlideVR.Server.Data;
using TimeGlideVR.Server.WebClient;
using TimeGlideVR.TableInstallation.Table.Panel;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using Unity.VisualScripting;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.ItemDropper
{
    public class MapIndicator : MonoBehaviour
    {
        [SerializeField] public Vector2 mapCoordinatesBottomLeft = new(51.652074717106686f, 12.655107034666422f);
        [SerializeField] public Vector2 mapCoordinatesTopRight = new(50.20243178812832f, 9.865952981932047f);
        [SerializeField] public Vector2 dropZoneSize = new(2.52f, 2.17f);

        [SerializeField] private GameObject cassettePrefab;
        [SerializeField] public DropObject dropItemTemplate;
        [SerializeField] public float spawnHeight = 1.8f;
        [SerializeField] public float despawnHeight = -1.0f;

        private float _ratioWidth;
        private float _ratioHeight;

        private ButtonPanelScript _buttonPanelScript;

        private readonly Dictionary<string, Transform> _spawnedItems = new();
        private TopographicalTableConfiguration _tableConfiguration;
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
                _buttonPanelScript.onButtonClick.AddListener(HandleButtonClick);

                LoadConfiguration().ConfigureAwait(false);
                //StartCoroutine(nameof(DisplayButtons));
            }
            catch (Exception e)
            {
                Debug.Log(e.ToString());
            }
        }

        public void StartDisplayButtons(){
            StartCoroutine(nameof(DisplayButtons));
        }

        // Need coroutine to get back to main thread
        private IEnumerator DisplayButtons()
        {
            if (!_dataLoaded)
                yield return new WaitForSeconds(1);

            _buttonPanelScript.Init(_tableConfiguration.LocationTimeRows);
            yield return null;
        }

        private async Task LoadConfiguration()
        {
            Debug.Log("Loading configuration...");
            var rooms = await _configurationClient.GetRooms();
            if (rooms.Count == 0)
            {
                Debug.Log("No rooms found, initializing dummy coordinates...");
                InitializeDummyCoordinates();
                return;
            }

            var firstRoom = rooms.FirstOrDefault();
            if (firstRoom == null)
            {
                Debug.Log("No rooms found, initializing dummy coordinates...");
                InitializeDummyCoordinates();
                return;
            }

            var roomDetails = await _configurationClient.GetRoom(firstRoom.Id);
            var firstTable = roomDetails?
                .InventoryPlacements.FirstOrDefault()?
                .InventoryItem?.Id;

            if (!firstTable.HasValue)
            {
                Debug.Log("No tables found, initializing dummy coordinates...");
                InitializeDummyCoordinates();
                return;
            }

            _tableConfiguration = await _configurationClient.GetTableConfiguration(firstTable.Value);
            _dataLoaded = true;
        }

        private void InitializeDummyCoordinates()
        {
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

            _tableConfiguration.LocationTimeRows = new List<LocationTimeRow>()
            {
                new LocationTimeRow
                {
                    Label = "Testdaten",
                    GeoEvents = _cityCoordinates
                        .Select(c => new GeoEvent
                            { Label = c.Key, Latitude = c.Value.y, Longitude = c.Value.y }).ToList()
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
                Type = "3dmp4",
                Url = "https://timeglide-vr.b-cdn.net/Intro.mp4"

            };
            SpawnOrDespawnItem("Informationen",
                new Vector2(50.582299f, 10.091699f), new List<MediaFile>{ media });
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
                    SpawnOrDespawnItem(geoEvent.Label,
                        new Vector2((float)geoEvent.Latitude, (float)geoEvent.Longitude), geoEvent.MediaFiles);
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

        private void SpawnOrDespawnItem(string label, Vector2 location, List<MediaFile> mediaFiles, bool remove = false)
        {
            if (_spawnedItems.ContainsKey(label))
            {
                Debug.Log($"Despawning item for city: {label}");
                Destroy(_spawnedItems[label].gameObject);
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
                _spawnedItems.Add(label, newDropObject.transform);
                if(mediaFiles.Count <= 0) return;
                var configureBubble = newDropObject.GetComponent<ConfigureBubble>();
                configureBubble.Init(mediaFiles, label, cassettePrefab);
            }
        }

        public void ClearItems()
        {
            Debug.Log("Clearing items...");
            foreach (var item in _spawnedItems.Values)
            {
                if (item != null && item.gameObject != null)
                    Destroy(item.gameObject);
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