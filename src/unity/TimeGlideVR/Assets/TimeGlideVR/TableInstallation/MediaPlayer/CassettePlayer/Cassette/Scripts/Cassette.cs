
using System;
using System.Collections;
using System.Collections.Generic;
using Oculus.Platform;
using TimeGlideVR.Server.Data;
using TimeGlideVR.Server.Data.Media;
using UnityEngine;
using UnityEngine.Events;

public class Cassette : MonoBehaviour
{
    [SerializeField]
    private UnityEvent spawnObjectEvent;
    [SerializeField]
    private UnityEvent<string> UpdateCityDisplayTextEvent;
    [SerializeField]
    private GameObject objectToSpawn;
    [SerializeField]
    List<MediaFile> mediaFiles = new List<MediaFile>();
    [SerializeField]
    private bool invokeEventOnInsert = true;
    private GameObject objectReference;

    public void Init(List<MediaFile> mediaFiles, string cityName){
        this.mediaFiles = mediaFiles;
        InvokeUpdateCityDisplayText(cityName);
    }
    public List<MediaFile> GetAllMediaFiles(){
        return mediaFiles;
    }
    public MediaFile GetMediaAt(int index = 0){
        return mediaFiles[index];
    }
    public void InvokeUpdateCityDisplayText(string newName){
        UpdateCityDisplayTextEvent.Invoke(newName);
    }

    public GameObject GetObjectToSpawn(){
        return objectToSpawn;
    }

    public void InvokeSpawnObjectEvent(){
        if(!invokeEventOnInsert) return;
        spawnObjectEvent.Invoke();
    }

    public void SpawnObject(){
        if(!objectToSpawn){ 
            return;
        }

        //currently just spawns a bubble
        GameObject newObj = Instantiate(objectToSpawn);
        newObj.transform.position = transform.position - transform.forward * 0.2f;
        /*
        GameObject newObj = Instantiate(objectToSpawn);
        objectReference = newObj;
        if(invokeEventOnInsert){
            TryStartMedia(newObj);
        }
        */
    }

    public void DestroyObject(){
        if(objectReference == null) return;
        Destroy(objectReference);
    }
}
