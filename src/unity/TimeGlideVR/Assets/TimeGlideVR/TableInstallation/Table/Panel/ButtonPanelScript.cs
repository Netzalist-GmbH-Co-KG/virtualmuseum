using System.Collections.Generic;
using System.Linq;
using TimeGlideVR.Debugging;
using TimeGlideVR.Server.Data;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using UnityEngine;
using UnityEngine.Events;

namespace TimeGlideVR.TableInstallation.Table.Panel
{
    public class ButtonPanelScript : MonoBehaviour
    {
        [SerializeField]
        private GameObject buttonPrefab;

        private readonly Dictionary<string, GameObject> _buttons = new();
        public UnityEvent<DisplayLocationTimeRowEvent> onButtonClick;
        
        private List<LocationTimeRow> _locationTimeRows;

        public void Init(List<LocationTimeRow> locationTimeRows)
        {
            _locationTimeRows = locationTimeRows;
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

        private void HandleButtonClick(ToggleButtonEvent evt)
        {
            Debug.Log("Panel Button Click on: " + evt.Name);
            var locationTimeRow = _locationTimeRows.FirstOrDefault(row => row.Label == evt.Name);
            if(locationTimeRow != null)
                onButtonClick.Invoke(new DisplayLocationTimeRowEvent(locationTimeRow, !evt.IsSelected));
        }

    }
}
