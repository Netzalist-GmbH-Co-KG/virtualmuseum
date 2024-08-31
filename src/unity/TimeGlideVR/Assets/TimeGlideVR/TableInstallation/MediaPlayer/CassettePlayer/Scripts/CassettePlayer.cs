using System;
using System.Collections;
using System.Collections.Generic;
using Oculus.Interaction;
using UnityEngine;
using UnityEngine.Events;

public class CassettePlayer : MonoBehaviour
{
    [SerializeField]
    List<string> acceptedTags = new List<string>();
    [SerializeField]
    private UnityEvent insertEvent;
    [SerializeField]
    private UnityEvent animateInsertFinishedEvent;
    [SerializeField]
    private UnityEvent ejectedEvent;
    [SerializeField]
    private AudioSource mediaEventAudioSource;
    [SerializeField]
    GameObject cassettePlacement;
    GameObject childEjectButtonReference;
    GameObject ejectionDirection;
    private bool cassetteInserted = false;
    private GameObject cassetteReference;
    private MediaTypeUnityEvents mediaTypeUnityEvents;
    private CasettePlayerStatus casettePlayerStatus;

    private void Update() {
        if(cassetteInserted && cassetteReference == null){
            RemoveCassette();
        }
    }

    public void InsertCassette(GameObject g){
        if(!acceptedTags.Contains(g.tag) || cassetteInserted){
            return;
        }
        
        if(!childEjectButtonReference){
            childEjectButtonReference = cassettePlacement.transform.GetChild(1).gameObject;   
        }
        if(!ejectionDirection){
            ejectionDirection = cassettePlacement.transform.GetChild(0).gameObject;   
        }
        mediaTypeUnityEvents = GetComponent<MediaTypeUnityEvents>();
        cassetteReference = g;
        cassetteInserted = true;
        insertEvent.Invoke();
    }

    public void AnimateInsert(){
        DeactivateHandGrab(cassetteReference);
        //UngrabGrabbableComponentOfObject(g);
        SetParentOfObject(cassetteReference);
        StartCoroutine(LerpToParent(cassetteReference));
    }

    public void RemoveCassette(){
        cassetteInserted = false;
        casettePlayerStatus.Open();
        if(cassetteReference) cassetteReference.transform.parent = null;
        ejectedEvent.Invoke();
        Eject();
    }

    /// <summary>
    /// Step two in removing cassette, call RemoveCassette() if you want to fully remove an object
    /// </summary>
    private void Eject(){
        ResetMedia();
        Debug.Log("Ejecting cassette");
        //maybe shoot out the cassette
        if(cassetteReference) { 
            ActivateHandGrab(cassetteReference);
            cassetteReference.TryGetComponent<Rigidbody>(out var rb);
            if(rb){
                rb.isKinematic = false;
                Vector3 dir = (ejectionDirection.transform.position - cassetteReference.transform.position).normalized;
                rb.AddForce(dir * 2, ForceMode.Impulse);
            }
            cassetteReference.TryGetComponent<FeatherFall>(out var featherFall);
            if(featherFall) featherFall.enabled = true;
            TryDestroySpawnedMedia();
            cassetteReference = null;
        }
        if(mediaEventAudioSource!=null && mediaEventAudioSource.isPlaying)
            mediaEventAudioSource.Stop();
        Debug.Log("Ejected cassette");
    }

    private IEnumerator LerpToParent(GameObject g){
        float i = 0;
        while(i < 1){
            g.transform.localPosition = Vector3.Lerp(g.transform.localPosition, Vector3.zero, i);
            g.transform.localRotation = Quaternion.Lerp(g.transform.localRotation, Quaternion.identity, i);
            i += Time.deltaTime;
            yield return new WaitForFixedUpdate();
        }
        casettePlayerStatus.Close();
        animateInsertFinishedEvent.Invoke();
    }

    private void SetParentOfObject(GameObject g){
        g.transform.parent = cassettePlacement.transform;
        g.TryGetComponent<Rigidbody>(out var rb);
        if(rb) {
            rb.isKinematic = true;
        }
    }

    private void DeactivateHandGrab(GameObject g){
        foreach(Transform tran in g.transform){
            tran.TryGetComponent<Grabbable>(out var grabbable);
            if(grabbable){
                tran.gameObject.SetActive(false);
            }
        }    
    }

    private void ActivateHandGrab(GameObject g){
        foreach(Transform tran in g.transform){
            tran.TryGetComponent<Grabbable>(out var grabbable);
            if(grabbable){
                tran.gameObject.SetActive(true);
            }
        }
    }

    public void TryReadCassette() {
        ResetMedia();
        Debug.Log("Trying to read cassette");
        if(!cassetteInserted || !cassetteReference) return;
        cassetteReference.TryGetComponent<Cassette>(out var cassette);

        if(!cassette) return;
        cassette.InvokeSpawnObjectEvent();

        var mediaReferences = cassette.GetAllMediaFiles();
        if(mediaReferences.Count == 0) {
            mediaTypeUnityEvents.InvokeResetMediaEvent();
            return;
        }
        foreach(var media in cassette.GetAllMediaFiles()){
            Debug.Log($"Media found: {media.Type} / {media.Name}");
            //check type of media and handle accordingly
            //what types dont mix:
            //2dmp4 and 3dmp4
            //3dmp4 and audio
            //2dmp4 and audio
            //3djpg and 3dmp4
            //2djpg and 2dmp4
            //if any of these are present, sequence them TODO
            switch(media.Type?.ToLowerInvariant()){
                case "3djpg":
                    mediaTypeUnityEvents.InvokeThreeSixtyImageEvent(media);
                    break;
                case "3dmp4":
                    mediaTypeUnityEvents.InvokeThreeSixtyVideoEvent(media);
                    break; 
                case "audio":
                    mediaTypeUnityEvents.InvokeDefaultAudioEvent(media);
                    break;
                case "2djpg":
                    mediaTypeUnityEvents.InvokeDefaultImageEvent(media);
                    break;
                case "2dmp4":
                    mediaTypeUnityEvents.InvokeDefaultVideoEvent(media);
                    break;
            }
        }
    }

    private void ResetMedia()
    {
        if(mediaTypeUnityEvents is null) return;
        mediaTypeUnityEvents.InvokeResetMediaEvent();
    }

    private void TryDestroySpawnedMedia(){
        cassetteReference.TryGetComponent<Cassette>(out var cassette);
        if(cassette){
            cassette.DestroyObject();
        }
    }

    private void Start()
    {
        casettePlayerStatus = GetComponentInChildren<CasettePlayerStatus>(true);
    }
}
