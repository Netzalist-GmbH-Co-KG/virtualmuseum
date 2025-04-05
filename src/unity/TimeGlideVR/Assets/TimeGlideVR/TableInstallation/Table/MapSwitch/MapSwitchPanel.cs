using System.Collections.Generic;
using System.Linq;
using TimeGlideVR.TableInstallation.Table.InfoDisplay;
using TimeGlideVR.TableInstallation.Table.Panel;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Events;

namespace TimeGlideVR.TableInstallation.Table.MapSwitch
{
    public class MapSwitchPanel : MonoBehaviour
    {
        public UnityEvent<ToggleButtonEvent> onMapSwitched;
        public List<Transform> buttonLocations;
        public List<ButtonScript> _buttons;
        private InfoDisplay.InfoDisplay _infoDisplay;

        private const string DefaultTitle = "Willkommen bei TimeGlideVR";
        private const string DefaultDescription = "Vor ihnen befindet sich eine gefärbte Höhenkarte von Schmalkalden.\n\nEinfach einen der Knöpfe drücken, um verschiedene Informationen abzurufen!";

        void Start()
        {
            SetUpButtons();
        }

        public void SetUpButtons(){
            _infoDisplay = FindObjectOfType<InfoDisplay.InfoDisplay>();
            _buttons = GetComponentsInChildren<ButtonScript>().ToList();

            foreach (var button in _buttons)
            {
                // Add a listener to the button's onClick event
                button.onClick.AddListener(HandleButtonClick);
            }
        }

        public Transform GetButtonLocation(int index){
            return buttonLocations[index];
        }
        private void HandleButtonClick(ToggleButtonEvent evt)
        {
            if (!evt.IsSelected)
            {
                onMapSwitched?.Invoke(new ToggleButtonEvent("Default", true, 0, 0));
                _infoDisplay.DisplayTitle(DefaultTitle);
                _infoDisplay.DisplayDescription(DefaultDescription);
                return;
            }

            foreach (var button in _buttons)
            {
                button.SetSelected(button.LabelText == evt.Name);
                if (button.LabelText == evt.Name)
                {
                    var infoData = button.GetComponent<InfoData>();
                    if (infoData != null)
                    {
                        _infoDisplay.DisplayTitle(infoData.title);
                        _infoDisplay.DisplayDescription(infoData.description);
                    }
                }
            }
            
            onMapSwitched?.Invoke(evt);
        }
    }
}
