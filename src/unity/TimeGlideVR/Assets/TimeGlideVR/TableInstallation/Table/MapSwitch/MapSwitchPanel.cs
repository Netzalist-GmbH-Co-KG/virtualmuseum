using System.Collections.Generic;
using System.Linq;
using TimeGlideVR.TableInstallation.Table.Panel;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using UnityEngine;
using UnityEngine.Events;

namespace TimeGlideVR.TableInstallation.Table.MapSwitch
{
    public class MapSwitchPanel : MonoBehaviour
    {
        public UnityEvent<ToggleButtonEvent> onMapSwitched;
        private List<ButtonScript> _buttons;

        void Start()
        {
            _buttons = GetComponentsInChildren<ButtonScript>().ToList();
            
            foreach (var button in _buttons)
            {
                // Add a listener to the button's onClick event
                button.onClick.AddListener(HandleButtonClick);
            }
        }

        private void HandleButtonClick(ToggleButtonEvent evt)
        {
            if (!evt.IsSelected)
            {
                onMapSwitched?.Invoke(new ToggleButtonEvent("Default", true));
                return;
            }

            foreach (var button in _buttons)
            {
                button.SetSelected(button.LabelText == evt.Name);
            }
            
            onMapSwitched?.Invoke(evt);
        }
    }
}
