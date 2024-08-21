using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rise : MonoBehaviour
{
    private Vector3 startPos;
    [SerializeField] private float speed = 0.3f;
    private void OnEnable() {
        StartCoroutine(RiseToZero());
    }

    private void OnDisable() {
        transform.position = startPos;
    }

    private IEnumerator RiseToZero(){
        startPos = transform.position;
        float i = 0;
        while(i < 1){
            transform.position = Vector3.Lerp(startPos, Vector3.zero, i);
            i += Time.deltaTime * speed;
            yield return new WaitForEndOfFrame();
        }
    }
}
