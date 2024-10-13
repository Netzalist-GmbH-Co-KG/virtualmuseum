using System.Collections;
using System.Collections.Generic;
using TimeGlideVR.Server.Data;
using TimeGlideVR.Server.Data.Media;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Serialization;

public class MediaTypeUnityEvents : MonoBehaviour
{
    public UnityEvent<PresentationItem> DisplayMedia;
    public void InvokeDisplayMedia(PresentationItem s)
    {
        DisplayMedia.Invoke(s);
    }
    
    
    [SerializeField]
    public UnityEvent<MediaFile> ThreeSixtyImageEvent;
    public void InvokeThreeSixtyImageEvent(MediaFile s)
    {
        ThreeSixtyImageEvent.Invoke(s);
    }

    [SerializeField]
    public UnityEvent<MediaFile> ThreeSixtyVideoEvent;
    public void InvokeThreeSixtyVideoEvent(MediaFile s)
    {
        ThreeSixtyVideoEvent.Invoke(s);
    }

    [SerializeField]
    public UnityEvent<MediaFile> DefaultImageEvent;
    public void InvokeDefaultImageEvent(MediaFile s)
    {
        DefaultImageEvent.Invoke(s);
    }

    [SerializeField]
    public UnityEvent<MediaFile> DefaultVideoEvent;
    public void InvokeDefaultVideoEvent(MediaFile s)
    {
        DefaultVideoEvent.Invoke(s);
    }

    [SerializeField]
    public UnityEvent<MediaFile> DefaultAudioEvent;
    public void InvokeDefaultAudioEvent(MediaFile s)
    {
        DefaultAudioEvent.Invoke(s);
    }

    [FormerlySerializedAs("GeneralMediaEvent")] [SerializeField]
    public UnityEvent ResetMediaEvent;
    public void InvokeResetMediaEvent()
    {
        ResetMediaEvent.Invoke();
    }
}
