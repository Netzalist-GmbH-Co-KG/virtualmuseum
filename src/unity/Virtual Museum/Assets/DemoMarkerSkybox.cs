using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DemoMarkerSkybox : MonoBehaviour
{
    public void LoadDemoSkyBox(){
        GameObject skyboxObject = GameObject.FindGameObjectWithTag("3DImageSphere").transform.GetChild(0).gameObject;
        skyboxObject.SetActive(true);
    }
}
