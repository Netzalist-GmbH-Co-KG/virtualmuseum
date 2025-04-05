using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Oculus.Interaction;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Events;

public class RotateTransformerEvents : MonoBehaviour
{
    [SerializeField] private int axis; // 0 = x, 1 = y, 2 = z
    [SerializeField] private bool min;
    [SerializeField] private float minAngleToTrigger;
    [SerializeField] private float maxAngleToTrigger;
    [SerializeField] private UnityEvent<int> triggerLeverEvent;
    [SerializeField] private UnityEvent<string> currentAngleEvent;
    
    private bool alreadyTriggered = false;
    private Quaternion startRotation;
    private float accumulatedAngle = 0f;
    private float previousAngle = 0f;
    private Vector3 rotationAxis;

    private void Start() {
        startRotation = transform.localRotation;
        
        // Set the rotation axis based on the axis parameter
        rotationAxis = axis == 0 ? Vector3.right : (axis == 1 ? Vector3.up : Vector3.forward);
        
        // Initialize previousAngle
        Vector3 startEuler = startRotation.eulerAngles;
        previousAngle = startEuler[axis];
        
        Debug.Log("Start rotation: " + startEuler[axis]);
    }

    void Update()
    {
        // Get current rotation in the specified axis
        float currentAngle = transform.localRotation.eulerAngles[axis];
        
        // Calculate the delta from the previous frame, handling 0/360 boundary
        float deltaAngle = Mathf.DeltaAngle(previousAngle, currentAngle);
        
        // Accumulate the angle change
        accumulatedAngle += deltaAngle;
        
        // Store current angle for next frame
        previousAngle = currentAngle;
        
        // Optional: Send current accumulated angle to any listeners
        currentAngleEvent?.Invoke(accumulatedAngle.ToString("F2"));
        
        // Check triggers based on accumulated angle
        if(min) {
            if(accumulatedAngle < minAngleToTrigger) {
                Debug.Log("Triggered min condition at accumulated angle: " + accumulatedAngle);
                if(alreadyTriggered) return; 
                triggerLeverEvent.Invoke(0);
                alreadyTriggered = true;
                return;
            }
            // Reset trigger if angle goes back above threshold
            if(accumulatedAngle > minAngleToTrigger + 1.0f) {
                alreadyTriggered = false;
            }
        } else {
            if(accumulatedAngle > maxAngleToTrigger) {
                Debug.Log("Triggered max condition at accumulated angle: " + accumulatedAngle);
                if(alreadyTriggered) return; 
                triggerLeverEvent.Invoke(1);
                alreadyTriggered = true;
                return;
            }
            // Reset trigger if angle goes back below threshold
            if(accumulatedAngle < maxAngleToTrigger - 1.0f) {
                alreadyTriggered = false;
            }
        }
    }
    
    // Call this method to reset the accumulated angle to zero
    public void ResetAngle()
    {
        accumulatedAngle = 0f;
        previousAngle = transform.localRotation.eulerAngles[axis];
        alreadyTriggered = false;
    }
}
