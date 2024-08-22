using System;
using System.Collections;
using TimeGlideVR.TableInstallation.ItemDropper;
using TimeGlideVR.TableInstallation.Table.Panel;
using UnityEngine;

namespace TimeGlideVR.TableInstallation
{
    public class InstallationController : MonoBehaviour
    {
        private MapIndicator _mapIndicator;
        private PanelMovement _panelMovement;
        
        private AudioSource _speaker;
        [SerializeField]
        private AudioClip initialMessage;
        [SerializeField]
        private AudioClip googByeMessage;
        [SerializeField]
        private AudioClip warning;

        void Awake()
        {
            try
            {
                _speaker = GetComponent<AudioSource>();
                _mapIndicator = GetComponentInChildren<MapIndicator>(true);
                _panelMovement = GetComponentInChildren<PanelMovement>(true);

                // TODO: Do not play immediately. Play when user enters zone later
                // StartCoroutine(nameof(PlayInitialMessage));
            }
            catch (Exception e)
            {
                Debug.Log(e.Message);
            }
        }

        
        private IEnumerator PlayInitialMessage()
        {
            yield return new WaitForSeconds(3);
            if(!_speaker.isPlaying)
                _speaker.PlayOneShot(initialMessage);
        } 
    
        public void HandleLiftAscending()
        {
            if(!_speaker.isPlaying)
                _speaker.PlayOneShot(warning);
        }

        public void HandleLiftTop()
        {
            _panelMovement.Extend();
        }
    
        public void HandleLiftDescending()
        {
            _mapIndicator.ClearItems();
            _panelMovement.Retract();
        }

        public void HandleLiftBottom()
        {
            if(!_speaker.isPlaying)
                _speaker.PlayOneShot(googByeMessage);
        }
    }
}
