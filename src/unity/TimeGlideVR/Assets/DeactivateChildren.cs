using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DeactivateChildren : MonoBehaviour
{
    private void OnEnable(){
        foreach(Transform t in transform){
            t.gameObject.SetActive(true);
        }
    }
    
    private void OnDisable(){
        foreach(Transform t in transform){
            t.gameObject.SetActive(false);
        }
    }
}
