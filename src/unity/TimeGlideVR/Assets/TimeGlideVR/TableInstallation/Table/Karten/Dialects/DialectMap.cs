using TimeGlideVR.TableInstallation.Table.Panel.Button;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.Table.Karten.Dialects
{
    public class DialectMap : MonoBehaviour
    {
        private SlideUpOnActive _firstFocus;

        public void Start()
        {
            _firstFocus = GetComponentInChildren<SlideUpOnActive>(true);
        }
        
        
        public void DisplayDialect(ToggleButtonEvent evt){
            Debug.Log($"Displaying dialect {evt.Name}");

            _firstFocus.gameObject.SetActive(evt.IsSelected);
            if(evt.IsSelected) _firstFocus.SlideUp();
        }

    }
}
