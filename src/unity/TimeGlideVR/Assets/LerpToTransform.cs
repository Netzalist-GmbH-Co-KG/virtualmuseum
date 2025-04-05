using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Animations;
using UnityEngine.Events;

public class LerpToTransform : MonoBehaviour
{
    [SerializeField] private UnityEvent onLerpEndEvent;
    [SerializeField] private bool lerpToStartingPosition = true;
    [SerializeField] private float lerpDuration = 0.5f;
    [SerializeField] private AnimationCurve lerpCurve = AnimationCurve.Linear(0, 0, 1, 1);
    private Vector3 startingPosition;
    private Quaternion startingRotation;
    private Vector3 targetPosition;
    private Quaternion targetRotation;

    private void Start()
    {
        startingPosition = transform.localPosition;
        startingRotation = transform.localRotation;
        targetPosition = startingPosition;
        targetRotation = startingRotation;
    }

    public void StartLerp()
    {
        startingPosition = transform.localPosition;
        startingRotation = transform.localRotation;
        this.targetPosition = targetPosition;
        this.targetRotation = targetRotation;
        StartCoroutine(Lerp());
    }

    private IEnumerator Lerp()
    {
        float t = 0f;
        while (t < lerpDuration)
        {
            t += Time.deltaTime;
            transform.localPosition = Vector3.Lerp(startingPosition, targetPosition, lerpCurve.Evaluate(t / lerpDuration));
            transform.localRotation = Quaternion.Slerp(startingRotation, targetRotation, lerpCurve.Evaluate(t / lerpDuration));
            yield return null;
        }
        onLerpEndEvent?.Invoke();
    }
}
