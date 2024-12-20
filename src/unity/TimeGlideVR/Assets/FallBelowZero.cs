using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FallBelowZero : MonoBehaviour
{
    [SerializeField]
    private bool destroyObject;
    [SerializeField]
    private bool spawnParent;
    [SerializeField]
    private int childPositionDepth;
    [SerializeField]
    private GameObject parentObject;
    [SerializeField]
    private bool useAwakePosition;
    private Vector3 awakePosition;
    [SerializeField]
    private bool useAwakeScale;
    private float awakeScale;
    
    private void Awake() {
        if(useAwakePosition) {
            awakePosition = transform.position;
        }
        if(useAwakeScale) {
            awakeScale = transform.localScale.x;
        }
    }

    public void SetAwakePos(Transform posTransform){
        awakePosition = posTransform.position;
    }

    // Update is called once per frame
    void Update()
    {
        if(transform.position.y < 0) {
            if(destroyObject) Destroy(gameObject);
            if(spawnParent) {
                //right now just used to instantiate a new bubble in the original position
                var parent = Instantiate(parentObject, awakePosition, Quaternion.identity);
                var child = parent.transform;
                for(int i = 0; i < childPositionDepth; i++) {
                    child = child.transform.GetChild(0);
                }
                transform.SetParent(child);
                transform.localPosition = Vector3.zero;
            } else {
                transform.position = awakePosition;
            }
        }
    }
}
