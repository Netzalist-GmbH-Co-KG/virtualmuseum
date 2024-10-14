using System;
using System.Collections;
using System.Collections.Generic;
using Oculus.Interaction;
using TimeGlideVR.MultiMediaPresentation;
using TimeGlideVR.Server.Data.Media;
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

    private MultiMediaPresentationPlayer multiMediaPresentationPlayer;

    private void Start() {
        casettePlayerStatus = GetComponentInChildren<CasettePlayerStatus>(true);
        multiMediaPresentationPlayer = GetComponent<MultiMediaPresentationPlayer>();
    }

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
        if(!cassetteInserted || !cassetteReference) return;
        cassetteReference.TryGetComponent<Cassette>(out var cassette);

        if(!cassette) return;
        cassette.InvokeSpawnObjectEvent();

        var cassettePresentation = cassette.GetPresentation();
        if(cassettePresentation is null){
            mediaTypeUnityEvents.InvokeResetMediaEvent();
            return;
        }

        multiMediaPresentationPlayer.Init(cassettePresentation);
        multiMediaPresentationPlayer.StartPresentation();
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
}
