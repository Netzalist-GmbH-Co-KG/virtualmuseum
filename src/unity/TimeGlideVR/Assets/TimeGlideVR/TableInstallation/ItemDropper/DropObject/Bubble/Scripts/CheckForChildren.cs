using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class CheckForChildren : MonoBehaviour
{
    [SerializeField]
    private UnityEvent onChildFound;
    private bool ChildFound;
    void Update()
    {
        if(transform.childCount == 0) {
            ChildFound = false;
            return;
        } else if (!ChildFound) {
            ChildFound = true;
            onChildFound.Invoke();
        }

    }
}
