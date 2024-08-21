using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Oculus.Interaction;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Events;

public class RotateTransformerEvents : MonoBehaviour
{
    [SerializeField]
    private float minAngleToTrigger;
    [SerializeField]
    private UnityEvent<int> triggerLeverEvent;
    [SerializeField]
    private UnityEvent<string> currentAngleEvent;
    private bool alreadyTriggered = false;

    // Update is called once per frame
    void Update()
    {
        transform.localRotation.ToAngleAxis(out float angle, out Vector3 axis);
        if(angle > minAngleToTrigger) {
            Debug.Log(angle);
            if(alreadyTriggered) return; 
            triggerLeverEvent.Invoke(0);
            alreadyTriggered = true;
            return;
        } else {
            alreadyTriggered = false;
        }
    }
}
