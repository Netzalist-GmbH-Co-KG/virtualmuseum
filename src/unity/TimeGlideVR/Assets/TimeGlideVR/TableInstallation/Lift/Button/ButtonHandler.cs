using UnityEngine;
using UnityEngine.Events;

namespace TimeGlideVR.TableInstallation.Lift.Button
{
    public class ButtonHandler : MonoBehaviour
    {
        public AudioSource buttonClickSound;

        [SerializeField]
        internal UnityEvent onClick;
        
        public void HandleButtonClick()
        {
            onClick.Invoke();
            if(buttonClickSound != null)
                if(buttonClickSound.isPlaying)
                    buttonClickSound.Stop();
            buttonClickSound.Play();
        }
    }
}
