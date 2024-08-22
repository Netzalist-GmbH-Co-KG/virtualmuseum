using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SlideUpOnActive : MonoBehaviour
{
    private Vector3 startPos;
    [SerializeField]
    private float endYValue;
    [SerializeField]
    private AnimationCurve curve;
    [SerializeField]
    private float speed;

    private void OnEnable() {
        StartCoroutine(SlideUp());
    }

    private void OnDisable() {
        transform.localPosition = startPos;
    }

    private IEnumerator SlideUp(){
        startPos = transform.localPosition;
        float i = 0;
        var target = new Vector3(transform.localPosition.x, endYValue, transform.localPosition.z);
        while(i < 1){
            transform.localPosition = Vector3.Lerp(startPos, target, curve.Evaluate(i));
            i += Time.deltaTime * speed;
            yield return new WaitForEndOfFrame();
        }
    }
}
