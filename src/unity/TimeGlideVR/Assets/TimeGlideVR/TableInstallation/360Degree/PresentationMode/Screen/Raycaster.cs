using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

[RequireComponent(typeof(LineRenderer))]
public class Raycaster : MonoBehaviour
{
    [Header("Transforms")]
    public Transform fromTransform;
    public Transform throughTransform;

    [Space]
    [Header("Settings")]
    public LayerMask ignoreMask;
    public string hitTag;
    public float minDistance;
    public float maxDistance = float.PositiveInfinity;

    [Space]
    [Header("Events")]
    public UnityEvent<Vector3> onSelectable;
    public UnityEvent<Vector3> onHover;
    public UnityEvent onMiss;

    [Space]
    [Header("Visualization")]
    public Color hitColor = Color.red;
    public Color hoverColor = Color.green;
    private Vector3 lastHitPos = Vector3.zero;
    private LineRenderer lineRenderer;


    void Update()
    {
        //Raycast from transform to through transform
        if (Physics.Raycast(fromTransform.position, (throughTransform.position - fromTransform.position).normalized, out RaycastHit hit, maxDistance, ~ignoreMask))
        {
            if (hit.transform.tag == hitTag)
            {
                if(hit.distance < minDistance && hit.distance < maxDistance){
                    onSelectable.Invoke(hit.point);
                    lastHitPos = hit.point;
                    DrawLine("hit");
                    return;
                }

                onHover.Invoke(hit.point);
                lastHitPos = hit.point;
                DrawLine("hover");
                return;
            }
        }
        
        if(lineRenderer == null){
            lineRenderer = GetComponent<LineRenderer>();
            lineRenderer.widthMultiplier = 0.1f;
        }
        lineRenderer.enabled = false;
        lastHitPos = Vector3.zero;
        onMiss.Invoke();
    }

    void DrawLine(string state){
        if(lineRenderer == null){
            lineRenderer = GetComponent<LineRenderer>();
            lineRenderer.widthMultiplier = 0.1f;
        }

        lineRenderer.enabled = true;
        if(lastHitPos == Vector3.zero) return;
        lineRenderer.SetPosition(0, fromTransform.position);
        lineRenderer.SetPosition(1, lastHitPos);
        switch(state){
            case "hit":
                lineRenderer.startColor = hitColor;
                lineRenderer.endColor = hitColor;
                break;
            case "hover":
                lineRenderer.startColor = hoverColor;
                lineRenderer.endColor = hoverColor;
                break;
        }
    }

    private void OnDisable() {
        lineRenderer.enabled = false;
    }

}
