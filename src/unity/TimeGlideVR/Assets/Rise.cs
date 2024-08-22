using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class Rise : MonoBehaviour
{
    private Vector3 startPos;
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
        transform.localPosition = startPos;
    }

    private IEnumerator RiseToZero(){
        startPos = transform.localPosition;
        float i = 0;
        while(i < 1){
            //sample from curve
            PlayAudio();
            transform.localPosition = Vector3.Lerp(startPos, Vector3.zero, curve.Evaluate(i));
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
