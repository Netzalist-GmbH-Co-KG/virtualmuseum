using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Serialization;
using UnityEngine.UI;

namespace TimeGlideVR.TableInstallation.Table.Panel.Button
{
    public class ButtonScript : MonoBehaviour
    {
        private bool _selected;
        [FormerlySerializedAs("light")] [FormerlySerializedAs("_light")] [SerializeField]
        private Light lightComponent;
        private AudioSource _clickSound;
        private TextMeshPro _label;
        private string labelText = null;
        
        [SerializeField]
        public UnityEvent<ToggleButtonEvent> onClick;

        private void Awake()
        {
            _label = GetComponentInChildren<TextMeshPro>();
            _clickSound = GetComponent<AudioSource>();
            if(labelText != null)
                _label.text = labelText;
            else
                labelText = _label.text;
        }

        public void Init(string label)
        {
            labelText = label;
            if(_label != null)
                _label.text = labelText;
        }
        
        public void SetSelected(bool selected)
        {
            _selected = selected;
            lightComponent.gameObject.SetActive(_selected);
        }

        public void HandleSelect()
        {
            _selected = !_selected;
            lightComponent.gameObject.SetActive(_selected);

            if(!_clickSound.isPlaying)
                _clickSound.Play();

            onClick.Invoke(new ToggleButtonEvent(labelText, _selected));
        }
        
    }
}