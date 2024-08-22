using System.Collections;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.Table.Karten.Dialects
{
    public class SlideUpOnActive : MonoBehaviour
    {
        private Vector3 startPos;
        [SerializeField]
        private float endYValue;
        [SerializeField]
        private AnimationCurve curve;
        [SerializeField]
        private float speed;

        private AudioSource _exampleSpeech;

        private void Start()
        {
            _exampleSpeech = GetComponent<AudioSource>();
        }
        
        public void SlideUp() {
            StartCoroutine(SlideUpNow());
        }

        private void OnDisable() {
            transform.localPosition = startPos;
        }

        private IEnumerator SlideUpNow(){
            Debug.Log($"Sliding {gameObject.name} up");
            startPos = transform.localPosition;
            float i = 0;
            var target = new Vector3(transform.localPosition.x, endYValue, transform.localPosition.z);
            while(i < 1){
                transform.localPosition = Vector3.Lerp(startPos, target, curve.Evaluate(i));
                i += Time.deltaTime * speed;
                yield return new WaitForEndOfFrame();
            }
            if(_exampleSpeech != null && _exampleSpeech.clip != null)
            {
                if (!_exampleSpeech.isPlaying)
                    _exampleSpeech.Play();
            }
        }
    }
}
