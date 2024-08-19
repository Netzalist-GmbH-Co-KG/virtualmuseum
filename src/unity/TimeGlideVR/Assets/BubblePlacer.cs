using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BubblePlacer : MonoBehaviour
{
    private List<Transform> _bubbles = new List<Transform>();
    
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
        float x = ((index + 1) % 2) * 0.3f;
        float z = (Mathf.Floor(index / 3) % 4) * 0.3f;
        float y = -(Mathf.Floor(index / 4) * 0.3f);
        return new Vector3(x, y, z);
    }
}
