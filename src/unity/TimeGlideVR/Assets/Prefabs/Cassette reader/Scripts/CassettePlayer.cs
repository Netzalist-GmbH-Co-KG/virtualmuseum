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
        StartCoroutine(lerpToParent(cassetteReference));
    }

    public void RemoveCassette(){
        cassetteInserted = false;
        cassetteReference.transform.parent = null;
        ejectedEvent.Invoke();
        EJECT();
    }

    private void EJECT(){
        //maybe shoot out the cassette
        ActivateHandGrab(cassetteReference);
        cassetteReference.TryGetComponent<Rigidbody>(out var rb);
        mediaEventAudioSource.Stop();
        rb.isKinematic = false;
        Vector3 dir = (ejectionDirection.transform.position - cassetteReference.transform.position).normalized;
        rb.AddForce(dir * 5, ForceMode.Impulse);
        cassetteReference.TryGetComponent<FeatherFall>(out var featherFall);
        featherFall.enabled = true;
        TryDestroySpawnedMedia();
        cassetteReference = null;
    }

    private IEnumerator lerpToParent(GameObject g){
        float i = 0;
        while(i < 1){
            g.transform.localPosition = Vector3.Lerp(g.transform.localPosition, Vector3.zero, i);
            g.transform.localRotation = Quaternion.Lerp(g.transform.localRotation, Quaternion.identity, i);
            i += Time.deltaTime;
            yield return new WaitForFixedUpdate();
        }
        animateInsertFinishedEvent.Invoke();
    }

    public void SetParentOfObject(GameObject g){
        g.transform.parent = cassettePlacement.transform;
        g.TryGetComponent<Rigidbody>(out var rb);
        if(rb) {
            rb.isKinematic = true;
        }
    }

    public void DeactivateHandGrab(GameObject g){
        foreach(Transform tran in g.transform){
            tran.TryGetComponent<Grabbable>(out var grabbable);
            if(grabbable){
                tran.gameObject.SetActive(false);
            }
        }    
    }

    public void ActivateHandGrab(GameObject g){
        foreach(Transform tran in g.transform){
            tran.TryGetComponent<Grabbable>(out var grabbable);
            if(grabbable){
                tran.gameObject.SetActive(true);
            }
        }
    }

    public void TryReadCassette(){
        if(!cassetteInserted || !cassetteReference) return;
        cassetteReference.TryGetComponent<Cassette>(out var cassette);

        if(!cassette) return;
        cassette.InvokeSpawnObjectEvent();

        var mediaReferences = cassette.GetAllMediaFiles();
        if(mediaReferences.Count == 0) {
            mediaTypeUnityEvents.InvokeGeneralMediaEvent();
            return;
        }
        foreach(var media in cassette.GetAllMediaFiles()){
            //check type of media and handle accordingly
            switch(media.Type){
                case "3Djpg":
                    mediaTypeUnityEvents.InvokeThreeSixtyImageEvent(media.Url);
                    break;
                case "3Dmp4":
                    mediaTypeUnityEvents.InvokeThreeSixtyVideoEvent(media.Url);
                    break; 
                case "audio":
                    mediaTypeUnityEvents.InvokeDefaultAudioEvent(media.Url);
                    break;
                case "2Djpg":
                    mediaTypeUnityEvents.InvokeDefaultImageEvent(media.Url);
                    break;
                case "2Dmp4":
                    mediaTypeUnityEvents.InvokeDefaultVideoEvent(media.Url);
                    break;
                default :
                    mediaTypeUnityEvents.InvokeGeneralMediaEvent();
                    break; 
            }
        }
    }

    public void TryDestroySpawnedMedia(){
        cassetteReference.TryGetComponent<Cassette>(out var cassette);
        if(cassette){
            cassette.DestroyObject();
        }
    }
}
