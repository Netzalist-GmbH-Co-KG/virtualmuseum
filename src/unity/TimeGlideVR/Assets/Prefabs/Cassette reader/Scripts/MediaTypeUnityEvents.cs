using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class MediaTypeUnityEvents : MonoBehaviour
{
    [SerializeField]
    UnityEvent<string> ThreeSixtyImageEvent;
    public void InvokeThreeSixtyImageEvent(string s)
    {
        ThreeSixtyImageEvent.Invoke(s);

    }

    [SerializeField]
    UnityEvent<string> ThreeSixtyVideoEvent;
    public void InvokeThreeSixtyVideoEvent(string s)
    {
        ThreeSixtyVideoEvent.Invoke(s);

    }

    [SerializeField]
    UnityEvent<string> DefaultImageEvent;
    public void InvokeDefaultImageEvent(string s)
    {
        DefaultImageEvent.Invoke(s);
    }

    [SerializeField]
    UnityEvent<string> DefaultVideoEvent;
    public void InvokeDefaultVideoEvent(string s)
    {
        DefaultVideoEvent.Invoke(s);
    }

    [SerializeField]
    UnityEvent<string> DefaultAudioEvent;
    public void InvokeDefaultAudioEvent(string s)
    {
        DefaultAudioEvent.Invoke(s);
    }

    [SerializeField]
    UnityEvent GeneralMediaEvent;
    public void InvokeGeneralMediaEvent()
    {
        GeneralMediaEvent.Invoke();
    }


}
