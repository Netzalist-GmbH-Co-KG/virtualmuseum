using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class OpacityController : MonoBehaviour
{
    public void TryMakeTransparent(){
        var mr = GetComponent<MeshRenderer>();
        var mats = mr.materials;

        foreach(var mat in mats){
            try{
                mat.SetFloat("_alphaOverride", 1f);
            } catch {
            }
        }
    }

    public void TryMakeOpaque(){
        var mr = GetComponent<MeshRenderer>();
        var mats = mr.materials;
        foreach(var mat in mats){
            try{
                mat.SetFloat("_alphaOverride", 0f);
            } catch {
            }
        }
    }
}
