using System.Collections.Generic;
using System.Linq;
using JetBrains.Annotations;
using TimeGlideVR.Server.Data;
using TimeGlideVR.TableInstallation.Table.InfoDisplay;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using UnityEngine;
using UnityEngine.Events;

namespace TimeGlideVR.TableInstallation.Table.Panel
{
    public class ButtonPanelScript : MonoBehaviour
    {
        [SerializeField]
        private GameObject buttonPrefab;
        
        [SerializeField] private GameObject wallButtonPrefab;
        [SerializeField] private GameObject dialectButtonPrefab;

        private readonly Dictionary<string, GameObject> _buttons = new();
        public UnityEvent<DisplayLocationTimeRowEvent> onTimeRowButtonClick;
        public UnityEvent onDespawnAllItems;
        public UnityEvent<ToggleButtonEvent> onWallButtonClick;
        public UnityEvent<ToggleButtonEvent> onDialectButtonClick;
        
        private List<LocationTimeRow> _locationTimeRows = new ();
        private List<ButtonScript> _dialectButtons;
        private List<ButtonScript> _wallButtons;
        
        [CanBeNull] private InfoDisplay.InfoDisplay _infoDisplay;

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

        public void Init(List<LocationTimeRow> locationTimeRows)
        {
            Debug.Log($"Initializing ButtonPanel with {locationTimeRows.Count} rows");
            _locationTimeRows = locationTimeRows;
        }

        public void DisplayButtons()
        {
            foreach (var timeRow in _locationTimeRows)
            {
                AddButton(timeRow.Label);
            }
        }

        private void AddButton(string label)
        {
            Debug.Log($"Adding button: {label}");
            var button = Instantiate(buttonPrefab, transform);
            button.GetComponentInChildren<ButtonScript>().Init(label);
            button.GetComponentInChildren<ButtonScript>().onClick.AddListener(HandleButtonClick);
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
            foreach (var button in _buttons.Values)
            {
                Destroy(button);
            }
            _buttons.Clear();
        }

        private void HandleButtonClick(ToggleButtonEvent evt)
        {
            Debug.Log("Panel Button Click on: " + evt.Name + " with selected = " + evt.IsSelected);
            var locationTimeRow = _locationTimeRows.FirstOrDefault(row => row.Label == evt.Name);
            if(locationTimeRow != null)
                onTimeRowButtonClick.Invoke(new DisplayLocationTimeRowEvent(locationTimeRow, !evt.IsSelected));
        }
    }
}
