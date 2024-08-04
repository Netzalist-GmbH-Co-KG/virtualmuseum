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
    private UnityEvent onTriggerEnterEvent;
    [SerializeField]
    private UnityEvent<string> currentAngleEvent;
    private bool alreadyTriggered = false;

    // Update is called once per frame
    void Update()
    {
        transform.rotation.ToAngleAxis(out float angle, out Vector3 axis);
        currentAngleEvent.Invoke(angle.ToString());
        if(angle > minAngleToTrigger) {
            Debug.Log(angle);
            if(alreadyTriggered) return; 
            onTriggerEnterEvent.Invoke();
            alreadyTriggered = true;
            return;
        } else {
            alreadyTriggered = false;
        }
    }
}
