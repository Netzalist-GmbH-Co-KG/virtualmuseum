using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class Cassette : MonoBehaviour
{
    [SerializeField]
    private UnityEvent spawnObjectEvent;
    [SerializeField]
    private GameObject objectToSpawn;
    [SerializeField]
    private string mediaGuid = "00000000-0000-0000-0000-000000000000";
    [SerializeField]
    private bool invokeEventOnInsert = true;
    public bool hasAudio = false;
    public bool playAudioOnInsert = true;
    public AudioClip audioClipSaved;
    private GameObject objectReference;

    private void Update() {
        if(transform.position.y < -10) Destroy(gameObject);
    }
    public Guid GetMediaGuid(){
        return Guid.Parse(mediaGuid);
    }

    public GameObject GetObjectToSpawn(){
        return objectToSpawn;
    }

    public void InvokeEvent(){
        if(!invokeEventOnInsert) return;
        spawnObjectEvent.Invoke();
    }

    public void SpawnObject(){
        if(!objectToSpawn){ 
            return;
        }

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

    public void TryStartMedia(GameObject newObj){
        newObj.TryGetComponent<IMediaPlayer>(out var media);
        if(media == null) return;
        media.mediaId = GetMediaGuid();
        media.GetMediaById();
    }
}
