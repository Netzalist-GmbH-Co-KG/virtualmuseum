using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class ScreenSpawner : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private GameObject screenPrefab;
    
    [Space]
    [Header("Settings")]
    [SerializeField] private int rows = 3;
    [SerializeField] private int amount = 5;
    [SerializeField] private float radius = 5f;
    [SerializeField] private float fov;
    [SerializeField] private float verticalOffset = 1f;
    [SerializeField] private bool scaleUp = false;
    
    [Space]
    [Header("Events")]
    [SerializeField] private UnityEvent onScreensSpawned;

    
    public Transform[,] screenTransforms;
    private Raycaster raycaster;

    private void Start() {
        SpawnScreens(amount, fov, radius);
    }

    private Vector3 originPos;
    private Vector3 targetPos;
    private void OnDrawGizmos() {
        if(screenTransforms == null) return;
        Gizmos.color = Color.red;
        //draw ray from first screen to the right
        Transform firstScreen = screenTransforms[0, 0];
        Gizmos.DrawLine(originPos, targetPos);
    }


    public void SpawnScreens(int amount, float fov, float radius){
        float anglePerBetweenObjects = fov / amount;
        float startAngle = -fov / 2 + anglePerBetweenObjects / 2;
        Vector3 upVector = Vector3.up * verticalOffset;
        screenTransforms = new Transform[rows, amount];
        for(int i = 0; i < screenTransforms.GetLength(0); i++){
            for(int j = 0; j < screenTransforms.GetLength(1); j++){
                var screen = Instantiate(screenPrefab, transform);
                screenTransforms[i, j] = screen.transform;
                screen.transform.position = transform.position + transform.forward * radius;
                screen.transform.RotateAround(Vector3.zero, transform.up, startAngle + anglePerBetweenObjects * j);
                screen.transform.LookAt(transform.position);
                screen.transform.forward = -screen.transform.forward;
                screen.transform.position = screen.transform.position + upVector - upVector * i;
            }
        }
        raycaster = screenTransforms[0,0].GetComponent<Raycaster>();
        raycaster.enabled = true;
        raycaster.onHover.AddListener(MakeScreensSmaller);
        raycaster.onMiss.AddListener(MakeScreensBigger);
        onScreensSpawned.Invoke();
    }

    private bool madeBigger = false;
    private bool madeSmaller = false;
    private void MakeScreensBigger()
    {
        if(madeSmaller || !scaleUp) {
            raycaster.enabled = false;
            return;
        }
        madeBigger = true;
        foreach(Transform screen in screenTransforms){
            screen.GetComponent<Resize>().Bigger();
        }
    }

    private void MakeScreensSmaller(Vector3 arg0)
    {
        if(madeBigger) {
            raycaster.enabled = false;
            return;
            }
        madeSmaller = true;
        foreach(Transform screen in screenTransforms){
            screen.GetComponent<Resize>().Smaller();
        }
    }
}
