using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Serialization;
using UnityEngine.UI;

namespace TimeGlideVR.TableInstallation.Table.Panel.Button
{
    using TimeGlideVR.TableInstallation.Table.InfoDisplay;
    public class ButtonScript : MonoBehaviour
    {
        private int buttonIndex;
        private int mapIndex;
        private bool _selected;
        [FormerlySerializedAs("light")] [FormerlySerializedAs("_light")] [SerializeField]
        private Light lightComponent;
        private AudioSource _clickSound;
        private TextMeshPro _label;
        public string LabelText { get; set; } = null;
        public string InfoTitle { get; set; } = null;
        public string InfoDescription { get; set; } = null;
        
        [SerializeField]
        public UnityEvent<ToggleButtonEvent> onClick;
        private void Awake()
        {
            _label = GetComponentInChildren<TextMeshPro>();
            _clickSound = GetComponent<AudioSource>();
            if(LabelText != null)
                _label.text = LabelText;
            else
                LabelText = _label?.text;
        }

        public void Init(string label, int buttonIndex, int mapIndex)
        {
            LabelText = label;
            this.buttonIndex = buttonIndex;
            this.mapIndex = mapIndex;
            if(_label != null)
                _label.text = LabelText;
        }
        
        public void SetSelected(bool selected)
        {
            _selected = selected;
            lightComponent.gameObject.SetActive(_selected);
        }

        public void HandleSelect()
        {
            if(MapToggle.Instance.IsSwitching) return;
            _selected = !_selected;
            lightComponent.gameObject.SetActive(_selected);

            if(!_clickSound.isPlaying)
                _clickSound.Play();

            if(InfoTitle != null && InfoTitle != "")
            {
                InfoDisplay.Instance.DisplayTitle(InfoTitle);
            }
            
            if(InfoDescription != null && InfoDescription != "")
            {
                InfoDisplay.Instance.DisplayDescription(InfoDescription);
            }
            
            onClick.Invoke(new ToggleButtonEvent(LabelText, _selected, mapIndex, buttonIndex));
        }
    }
}
