using TimeGlideVR.TableInstallation.Table.Karten;
using TimeGlideVR.TableInstallation.Table.Karten.Dialects;
using TimeGlideVR.TableInstallation.Table.Karten.Fortification;
using TimeGlideVR.TableInstallation.Table.MapSwitch;
using TimeGlideVR.TableInstallation.Table.Panel;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using UnityEngine;
using System.Collections.Generic;

namespace TimeGlideVR.TableInstallation.Table
{
    public class MapToggle : MonoBehaviour
    {
        public static MapToggle Instance { get; private set; }
        [SerializeField] private AudioSource mapSwitchAudio;
        [SerializeField] private GameObject[] maps;
        [SerializeField] private int currentMapIndex = 0;
        [SerializeField] private MapSwitchScript mapSwitchScript;
        private ButtonPanelScript _buttonPanelScript;
        public bool IsSwitching = false;

        [SerializeField] private List<GameObject> additionalButtons;

        private DialectMap _dialectMap;
        private FortificationMap _fortificationMap;
        
        //0 Karte Default
        //1 Karte Stadtbefestigungen
        //2 Karte Dialekte
        //3 Karte Thüringen
        public void SetMap(int index, int buttonIndex, bool withButtons = true)
        {
            if(index == currentMapIndex){
                if(withButtons){
                    AfterMapSwitchMethod(buttonIndex);
                }
                return;
            }
            mapSwitchScript._isSwitching = true;
            IsSwitching = true;
            if(mapSwitchScript == null) mapSwitchScript = GetComponent<MapSwitchScript>();
            mapSwitchAudio.Play();
            if(withButtons) {
                mapSwitchScript.onSwitchComplete.AddListener((int i) => AfterMapSwitchMethod(buttonIndex));
            }
            //Debug.Log("Switching maps from " + currentMapIndex + " to " + index);
            mapSwitchScript.SwitchBetweenObjectsLerpSize(maps[currentMapIndex], maps[index]);
            currentMapIndex = index;
        }
        private void OnEnable()
        {
            Instance = this;
        }

        void Start()
        {
            _dialectMap = GetComponentInChildren<DialectMap>(true);
            _fortificationMap = GetComponentInChildren<FortificationMap>(true);
            _buttonPanelScript = GetComponentInChildren<ButtonPanelScript>(true);
            _buttonPanelScript.onDialectButtonClick.AddListener(_dialectMap.DisplayDialect);
            _buttonPanelScript.onWallButtonClick.AddListener(_fortificationMap.DisplayPhase);
        }

        private void AfterMapSwitchMethod(int buttonIndex){
            _buttonPanelScript.DisplayGeoEventGroupButtonsById(buttonIndex);
            mapSwitchScript.onSwitchComplete.RemoveAllListeners();
        }

        public void DeactivateAdditionalButtons()
        {
            foreach (var button in additionalButtons)
            {
                button.SetActive(false);
            }
        }
    }
}
