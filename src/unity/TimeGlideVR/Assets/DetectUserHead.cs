using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

[RequireComponent(typeof(Collider))]
public class DetectUserHead : MonoBehaviour
{
    [SerializeField]
    private UnityEvent headDetected;
    [SerializeField]
    private UnityEvent headLeft;


    private void OnTriggerEnter(Collider other){
        if(other.gameObject.tag == "MainCamera") headDetected.Invoke();
    }
    private void OnTriggerExit(Collider other) {
        if(other.gameObject.tag == "MainCamera") headLeft.Invoke();
    }
    
}
