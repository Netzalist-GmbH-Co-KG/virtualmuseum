using System.Collections.Generic;
using System.Linq;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.Table.Karten.Fortification
{
    public class FortificationMap : MonoBehaviour
    {
        private List<Rise> _phases;
        public void Start()
        {
            _phases = GetComponentsInChildren<Rise>(true)
                .OrderBy(r=>r.gameObject.name)
                .ToList();
        }
        
        public void DisplayPhase(ToggleButtonEvent evt)
        {
            Debug.Log($"Displaying phase {evt.Name}");
            var phase = evt.Name.Substring(6,1);
            foreach (var p in _phases)
            {
                p.gameObject.SetActive(p.gameObject.name.EndsWith(phase) && evt.IsSelected);
            }
        }
    }
}
