using TimeGlideVR.TableInstallation.Table.Karten;
using TimeGlideVR.TableInstallation.Table.Karten.Dialects;
using TimeGlideVR.TableInstallation.Table.Karten.Fortification;
using TimeGlideVR.TableInstallation.Table.MapSwitch;
using TimeGlideVR.TableInstallation.Table.Panel;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using Unity.VisualScripting;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.Table
{
    public class MapToggle : MonoBehaviour
    {
        [SerializeField] private GameObject[] maps;
        [SerializeField] private int currentMapIndex = 0;
        private ButtonPanelScript _buttonPanelScript;

        [SerializeField] private GameObject dialectsButtons;
        [SerializeField] private GameObject fortificationsButtons;

        private DialectMap _dialectMap;
        private FortificationMap _fortificationMap;
        
        public void SetMap(int index){
            if (index > 4) index = 3;
            if(maps==null || index < 0 || index >= maps.Length) return;
            currentMapIndex = index;
            for(var i = 0; i < maps.Length; i++){
                maps[i].SetActive(i == currentMapIndex);
            }
        }

        void Start()
        {
            var mapSwitchPanel = GetComponentInChildren<MapSwitchPanel>(true);
            _dialectMap = GetComponentInChildren<DialectMap>(true);
            _fortificationMap = GetComponentInChildren<FortificationMap>(true);
            _buttonPanelScript = GetComponentInChildren<ButtonPanelScript>(true);
            _buttonPanelScript.onDialectButtonClick.AddListener(_dialectMap.DisplayDialect);
            _buttonPanelScript.onWallButtonClick.AddListener(_fortificationMap.DisplayPhase);
            
            mapSwitchPanel.onMapSwitched.AddListener( HandleOnMapSwitch );
                
            SetMap(3);
        }

        private void HandleOnMapSwitch(ToggleButtonEvent evt)
        {
            var map = evt.Name switch
            {
                "Stadtbefestigungen von Schmalkalden" => 1,
                "Dialekte in Thüringen" => 2,
                "Urkundliche Ersterwähnungen" => 3,
                "Größte Städte um 1600" => 4,
                "Informationen zu Schloss Wilhelmsburg" => 5,
                _ => 0
            };
            SetMap(map);

            switch (map)
            {
                case 5:
                    _buttonPanelScript.DisplayButtonsInformationen();
                    fortificationsButtons.SetActive(false);
                    dialectsButtons.SetActive(false);
                    break;
                    
                case 4:
                    _buttonPanelScript.DisplayButtonsGroessteStaedte();
                    fortificationsButtons.SetActive(false);
                    dialectsButtons.SetActive(false);
                    break;
                case 3:
                    _buttonPanelScript.DisplayButtonsErstErwaehnung();
                    fortificationsButtons.SetActive(false);
                    dialectsButtons.SetActive(false);
                    break;
                case 1:
                    _buttonPanelScript.ClearButtons();
                    fortificationsButtons.SetActive(true);
                    dialectsButtons.SetActive(false);
                    break;
                case 2:
                    _buttonPanelScript.ClearButtons();
                    fortificationsButtons.SetActive(false);
                    dialectsButtons.SetActive(true);
                    break;
                default:
                    _buttonPanelScript.ClearButtons();
                    fortificationsButtons.SetActive(false);
                    dialectsButtons.SetActive(false);
                    break;
            }
        }
    }
}
