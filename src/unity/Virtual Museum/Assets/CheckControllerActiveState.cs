using System.Collections;
using System.Collections.Generic;
using Oculus.Interaction;
using UnityEngine;

public class CheckControllerActiveState : MonoBehaviour
{
    public List<ControllerActiveState> _activeState = new List<ControllerActiveState>();
    void Update()
    {
        int c = 0;
        foreach(ControllerActiveState state in _activeState){
            Debug.Log(state.Active);
            if(state.Active){
                c ++;
            }
            Debug.Log(c);
        }
        if(c == 2){
            foreach(Transform child in transform){
                Debug.Log("Enabling " + child.gameObject.name);
                child.gameObject.SetActive(true);
            }
        } else if(c < 2){
            Debug.Log(c);
            foreach(Transform child in transform){
                Debug.Log("Disabling " + child.gameObject.name);
                child.gameObject.SetActive(false);
            }
        }
    }
}
