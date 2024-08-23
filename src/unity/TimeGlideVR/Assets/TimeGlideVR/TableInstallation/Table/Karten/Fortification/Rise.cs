using System.Collections;
using UnityEngine;
using UnityEngine.Events;

namespace TimeGlideVR.TableInstallation.Table.Karten
{
    public class Rise : MonoBehaviour
    {
        private Vector3 _startPos;
        [SerializeField] private float speed = 0.3f;
        [SerializeField] private AnimationCurve curve;
        [SerializeField] private UnityEvent onEnableEvent;
        [SerializeField] private UnityEvent onFinishMovingEvent;
        [SerializeField] private AudioSource movingSound;
    
        private void OnEnable() {
            onEnableEvent.Invoke();
            StartCoroutine(RiseToZero());
        }

        private void OnDisable() {
            transform.localPosition = _startPos;
        }

        private IEnumerator RiseToZero(){
            Debug.Log($"Rising {gameObject.name}");
            _startPos = transform.localPosition;
            var destPost = new Vector3(_startPos.x, 0f, _startPos.z);
            float i = 0;

            while(i < 1){
                PlayAudio();
                //sample from curve
                transform.localPosition = Vector3.Lerp(_startPos, destPost, curve.Evaluate(i));
                i += Time.deltaTime * speed;
                yield return new WaitForEndOfFrame();
            }
            onFinishMovingEvent.Invoke();
        }

        private void PlayAudio()
        {
            if (movingSound is not null && movingSound.clip is not null)
            {
                if (!movingSound.isPlaying)
                    movingSound.Play();
            }
        }
    }
}
