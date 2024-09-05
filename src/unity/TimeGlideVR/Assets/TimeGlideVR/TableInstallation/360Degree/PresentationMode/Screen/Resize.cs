using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Resize : MonoBehaviour
{
    [SerializeField] Raycaster raycaster;

    public void Smaller(){
        transform.localScale *= 0.99f;
        raycaster.maxDistance *= 0.99f;
        transform.localPosition = new Vector3(transform.localPosition.x, transform.localPosition.y * 0.99f, transform.localPosition.z);
    }

    public void Bigger(){
        transform.localScale *= 1.01f;
        raycaster.maxDistance *= 1.01f;
        transform.localPosition = new Vector3(transform.localPosition.x, transform.localPosition.y * 1.01f, transform.localPosition.z);
    }
    
}
