using System.Collections;
using System.Collections.Generic;
using Oculus.Interaction;
using UnityEngine;

public class CheckControllerActiveState : MonoBehaviour
{
    public List<ControllerActiveState> _activeState = new List<ControllerActiveState>();
    private bool childrenActive = false;
    Coroutine deactivationRoutine;
    void Update()
    {
        int c = 0;
        foreach(ControllerActiveState state in _activeState){
            if(state.Active){
                c ++;
            }
        }
        if(c == 2){
            childrenActive = true;
            if(deactivationRoutine != null){
                StopCoroutine(deactivationRoutine);
            }
            foreach(Transform child in transform){
                child.gameObject.SetActive(true);
            }
        } else if(childrenActive && c < 2){
            childrenActive = false;
            deactivationRoutine = StartCoroutine(DeactivateAdminUI());
        }
    }

    IEnumerator DeactivateAdminUI(){
        yield return new WaitForSeconds(1f);
        foreach(Transform child in transform){
            child.gameObject.SetActive(false);
        }
    }
}
