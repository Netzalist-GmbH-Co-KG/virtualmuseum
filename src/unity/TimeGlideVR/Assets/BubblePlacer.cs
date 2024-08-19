using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BubblePlacer : MonoBehaviour
{
    private List<Transform> _bubbles = new List<Transform>();
    

    /// <summary>
    /// Start is called on the frame when a script is enabled just before
    /// any of the Update methods is called the first time.
    /// </summary>
    private void Start()
    {
        for(int i = 0; i < 12; i++){
            var g = GameObject.CreatePrimitive(PrimitiveType.Cube);
            g.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
            var pos = GetPositionByIndex(i);
            Debug.Log(transform.position + " : " + pos);
            g.transform.position = transform.position + GetPositionByIndex(i);
        }
    }        

    public void PlaceBubble(Transform bubbleTransform, GameObject cas){
        int index = _bubbles.Count;
        _bubbles.Add(bubbleTransform);
        
        bubbleTransform.transform.position = - transform.localToWorldMatrix.MultiplyPoint3x4(GetPositionByIndex(index));
        bubbleTransform.transform.localRotation = Quaternion.identity;
        bubbleTransform.transform.localScale = Vector3.one;
        cas.GetComponent<FallBelowZero>().SetAwakePos(bubbleTransform.position);
    }

    private Vector3 GetPositionByIndex(int index){
        if(index == 0) return Vector3.zero;
    
        float x = - (index % 2) * 0.3f;  // Alternates between 0 and 0.3
        float z = - ((index / 2) % 2) * 0.3f;  // Alternates between 0 and 0.3 every two
        float y = (Mathf.Floor(index / 4) * 0.3f);  // Moves up every 4

        return new Vector3(x,y,z);
    }
}
