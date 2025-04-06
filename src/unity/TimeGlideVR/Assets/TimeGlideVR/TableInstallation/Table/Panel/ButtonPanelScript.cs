using System.Collections.Generic;
using System.Linq;
using JetBrains.Annotations;
using TimeGlideVR.Server.Data.Inventory;
using TimeGlideVR.Server.Data.TimeRows;
using TimeGlideVR.TableInstallation.Table.InfoDisplay;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using UnityEngine;
using UnityEngine.Events;
using TimeGlideVR.TableInstallation.Table.MapSwitch;
using System.IO;

namespace TimeGlideVR.TableInstallation.Table.Panel
{
    public class ButtonPanelScript : MonoBehaviour
    {
        [SerializeField]
        private GameObject buttonPrefab;
        
        [SerializeField] private Transform timeSeriesButtonLocation;
        [SerializeField] private GameObject wallButtonPrefab;
        [SerializeField] private GameObject dialectButtonPrefab;
        
        [SerializeField] private MapSwitchPanel mapSwitchPanel;

        private readonly Dictionary<string, GameObject> _buttons = new();
        private readonly Dictionary<string, GameObject> _timeSeriesButtons = new();
        public UnityEvent<DisplayLocationTimeRowEvent> onTimeRowButtonClick;
        public UnityEvent onDespawnAllItems;
        public UnityEvent<ToggleButtonEvent> onWallButtonClick;
        public UnityEvent<ToggleButtonEvent> onDialectButtonClick;
        
        private List<GeoEventGroup> _geoEventGroupsErstErwaehnung = new ();
        private List<GeoEventGroup> _geoEventGroupsGroessteStaedte = new();
        private List<GeoEventGroup> _geoEventGroupsInformationen = new();
        private List<GeoEventGroup> _currentGeoEventGroup = new();
        private List<ButtonScript> _dialectButtons;
        private List<ButtonScript> _wallButtons;
        
        [CanBeNull] private InfoDisplay.InfoDisplay _infoDisplay;

        public Dictionary<string, GameObject> Buttons => _buttons;
        public Dictionary<string, GameObject> TimeSeriesButtons => _timeSeriesButtons;

        private List<TimeSeries> _timeSeries = new List<TimeSeries>();
        
        public void Start()
        {
            _infoDisplay = FindObjectOfType<InfoDisplay.InfoDisplay>();
            _dialectButtons = dialectButtonPrefab.GetComponentsInChildren<ButtonScript>().ToList();
            _wallButtons = wallButtonPrefab.GetComponentsInChildren<ButtonScript>().ToList();
            
            foreach (var button in _dialectButtons)
            {
                button.onClick.AddListener(HandleDialectButtonClick);
            }
            foreach (var button in _wallButtons)
            {
                button.onClick.AddListener(HandleWallButtonClick);
            }
        }

        private void HandleWallButtonClick(ToggleButtonEvent evt)
        {
            onWallButtonClick.Invoke(evt);
            foreach (var button in _wallButtons)
            {
                button.SetSelected(button.LabelText == evt.Name && evt.IsSelected);
                if (button.LabelText == evt.Name && evt.IsSelected && _infoDisplay != null)
                {
                    var displayData = button.GetComponent<InfoData>();
                    if (displayData != null)
                    {
                        _infoDisplay.DisplayTitle(displayData.title);
                        _infoDisplay.DisplayDescription(displayData.description);
                    }
                }
            }
        }

        private void HandleDialectButtonClick(ToggleButtonEvent evt)
        {
            onDialectButtonClick.Invoke(evt);
            foreach (var button in _dialectButtons)
            {
                button.SetSelected(button.LabelText == evt.Name && evt.IsSelected);
                if (button.LabelText == evt.Name && evt.IsSelected && _infoDisplay != null)
                {
                    var displayData = button.GetComponent<InfoData>();
                    if (displayData != null)
                    {
                        _infoDisplay.DisplayTitle(displayData.title);
                        _infoDisplay.DisplayDescription(displayData.description);
                    }
                }

            }
        }

        /*
        public void Init(List<GeoEventGroup> geoEventGroupsErstErwaehnung, List<GeoEventGroup> geoEventGroupsGroessteStaedte, List<GeoEventGroup> geoEventGroupsInformationen)
        {
            Debug.Log($"Initializing ButtonPanel with {geoEventGroupsErstErwaehnung.Count} rows");
            _geoEventGroupsInformationen = geoEventGroupsInformationen;
            _geoEventGroupsGroessteStaedte = geoEventGroupsGroessteStaedte;
            _geoEventGroupsErstErwaehnung = geoEventGroupsErstErwaehnung;
            _currentGeoEventGroup = _geoEventGroupsErstErwaehnung;
        }           Outdated hardcoded code
        */

        public void DisplayTimeSeriesButtonsByTopic(TopographicalTableTopic topic)
        {
            _timeSeries = topic.TimeSeries;
            _currentGeoEventGroup = null;
            ClearTimeSeriesButtons();
            foreach (var timeSeries in _timeSeries)
            {
                AddTimeSeriesButton(timeSeries.Name);
            }
            if(topic.Topic == "Thüringen"){
                AddTimeSeriesButton("Dialekte in Thüringen");
                AddTimeSeriesButton("Stadtbefestigungen von Schmalkalden");
            }
            mapSwitchPanel.SetUpButtons();
        }

        public void DisplayTimeSeriesButtons(ToggleButtonEvent evt)
        {
            _currentGeoEventGroup = null;
            ClearTimeSeriesButtons();
            foreach (var timeSeries in _timeSeries)
            {
                AddTimeSeriesButton(timeSeries.Name);
            }
            mapSwitchPanel.SetUpButtons();
        }

        public void DisplayGeoEventGroupButtonsById(int timeSeriesId)
        {
            ClearButtons();
            if (_timeSeries == null || _timeSeries.Count <= timeSeriesId)
            {
                Debug.LogError($"Invalid time series index: {timeSeriesId}");
                return;
            }
            _currentGeoEventGroup = _timeSeries[timeSeriesId].GeoEventGroups;

            foreach (var geoEventGroup in _currentGeoEventGroup)
            {
                AddGeoEventGroupButton(geoEventGroup.Label, _timeSeries[timeSeriesId].Name);
            }
        }

        private void AddTimeSeriesButton(string label){
            Debug.Log($"Adding button: {label}");
            int map = label switch
            {
                "Stadtbefestigungen von Schmalkalden" => 1,
                "Dialekte in Thüringen" => 2,
                "Urkundliche Ersterwähnungen" => 3,
                "Größte Städte Thüringens um 1600" => 3,
                "Informationen zu Schloss Wilhelmsburg" => 3,
                _ => 3
            };
            var button = Instantiate(buttonPrefab, mapSwitchPanel.transform);
            button.GetComponentInChildren<ButtonScript>().Init(label, _timeSeriesButtons.Count, map);
            button.GetComponentInChildren<ButtonScript>().onClick.AddListener(HandleTimeSeriesButtonClick);
            var _buttonTransform = mapSwitchPanel.GetButtonLocation(_timeSeriesButtons.Count);
            
            mapSwitchPanel._buttons.Add(button.GetComponentInChildren<ButtonScript>());
            button.transform.localPosition = _buttonTransform.localPosition;
            button.transform.rotation = _buttonTransform.rotation;
            button.transform.localScale = Vector3.one * 0.73f;
            _timeSeriesButtons.Add(label, button);
        }

        private void AddGeoEventGroupButton(string label, string timeSeriesName)
        {
            Debug.Log($"Adding button: {label}");
            var button = Instantiate(buttonPrefab, transform);
            button.GetComponentInChildren<ButtonScript>().Init(label, _buttons.Count, 0);
            button.GetComponentInChildren<ButtonScript>().onClick.AddListener(HandleGeoEventGroupButtonClick);
            var location = NextButtonLocation();
            button.transform.localPosition = location;
            _buttons.Add(label, button);
        }

        private Vector3 NextButtonLocation()
        {
            var row = _buttons.Count / 16;
            var column = _buttons.Count % 16;
            var topOffset = _buttons.Count < 16 ? 0f : 0.0455f;
            
            return new Vector3(-1.5f + column * 0.2f, 0.031f, topOffset - row * 0.1752f);
        }

        public void ClearButtons(){
            onDespawnAllItems.Invoke();
            MapToggle.Instance.DeactivateAdditionalButtons();
            foreach (var button in _buttons.Values)
            {
                Destroy(button);
            }
            _buttons.Clear();
        }

        public void ClearTimeSeriesButtons(){
            onDespawnAllItems.Invoke();
            foreach (var button in _timeSeriesButtons.Values)
            {
                mapSwitchPanel._buttons.Remove(button.GetComponentInChildren<ButtonScript>());
                Destroy(button);
            }
            _timeSeriesButtons.Clear();
            ClearButtons();
        }

        private void HandleTimeSeriesButtonClick(ToggleButtonEvent evt)
        {
            if(MapToggle.Instance.IsSwitching) return;
            Debug.Log("Panel Button Click on: " + evt.Name + " with selected = " + evt.IsSelected + " withMapIndex = " + evt.mapIndex + " withButtonIndex = " + evt.buttonIndex);
            ClearButtons();
//----------------------------------------------------------------------------HARDCODED
            if(evt.buttonIndex > _timeSeries.Count - 1){
                if(evt.mapIndex == 1){ //Stadtmauern
                    Debug.Log("Switching to wall map");
                    wallButtonPrefab.SetActive(true);
                    MapToggle.Instance.SetMap(evt.mapIndex, evt.buttonIndex, false);
                }
                else if (evt.mapIndex == 2) { //Dialekte
                    Debug.Log("Switching to dialect map");
                    dialectButtonPrefab.SetActive(true);
                    MapToggle.Instance.SetMap(evt.mapIndex, evt.buttonIndex, false);
                }
                return;
            }
//----------------------------------------------------------------------------HARDCODED
            Debug.Log("Switching to new map: " + evt.Name);
            MapToggle.Instance.SetMap(evt.mapIndex, evt.buttonIndex);
        }

        private void HandleGeoEventGroupButtonClick(ToggleButtonEvent evt)
        {
            Debug.Log("Panel Button Click on: " + evt.Name + " with selected = " + evt.IsSelected);
            var geoEventGroup = _currentGeoEventGroup.FirstOrDefault(row => row.Label == evt.Name);
            if(geoEventGroup != null)
                onTimeRowButtonClick.Invoke(new DisplayLocationTimeRowEvent(geoEventGroup, !evt.IsSelected));
        }
    }
}
