using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PopScript : MonoBehaviour
{
    [SerializeField]
    private Bubble bubbleScript;
    public void OnTriggerEnter(Collider collider){
        if(collider.CompareTag("CollisionIgnore")) return;
        if(bubbleScript.ObjectInBubble == collider.gameObject){
            return;
        }
        if(bubbleScript.ObjectInBubble){
            foreach(Transform child in bubbleScript.ObjectInBubble.transform){
                if(collider.gameObject == child.gameObject){
                    return;
                }
            }
        }

        GetComponent<SphereCollider>().enabled = false;
        Debug.Log(collider.name);
        bubbleScript.Pop();
    }
}
