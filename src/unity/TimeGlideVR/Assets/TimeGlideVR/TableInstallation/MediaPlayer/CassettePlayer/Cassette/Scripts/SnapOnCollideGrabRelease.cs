using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SnapOnCollideGrabRelease : MonoBehaviour
{
    [SerializeField]
    AudioSource audioSource;
    Transform parent;

    public void SnapToParent(){
        if(parent == null) return;

        audioSource.Play();
        if(GetComponent<Rigidbody>()){
            GetComponent<Rigidbody>().isKinematic = true;
        }
        StartCoroutine(lerpToParent());
    }

    private IEnumerator lerpToParent(){
        float i = 0;
        while(i < 1){
            transform.localPosition = Vector3.Lerp(transform.localPosition, parent.transform.position, i);
            transform.localRotation = Quaternion.Lerp(transform.localRotation, parent.transform.rotation, i);
            i += Time.deltaTime;
            yield return new WaitForEndOfFrame();
        }
    }

    private void OnTriggerEnter(Collider other) {
        if(other.gameObject == gameObject) return;
        if(other.transform.name == "CassettePlacement"){
            SnapToParent();
            Debug.Log("Parent: " + parent);
            parent = other.transform;
        }
    }

    private void OnTriggerExit(Collider other) {
        if(other.transform.name == "CassettePlacement"){
            parent = null;
        }
    }
}
