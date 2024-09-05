using System.Collections;
using System.Collections.Generic;
using TimeGlideVR.Server.Data;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Video;

public class PresentationMediaManager : MonoBehaviour
{
    [SerializeField] private UnityEvent<string> startStreamEvent;
    [SerializeField] private List<Stream> streams = new List<Stream>();
    [SerializeField] private string presentationUrl;
    private float timer = 0;
    public bool playing = false;

    private void Update() {
        //increment timer and call PlayMediaAtTime on all streams with given timer
        if(!playing) return;
        timer += Time.deltaTime; 
        foreach(var stream in streams) {
            stream.PlayMediaAtTime(timer);
        }
    }

    public void SetPresentationUrlAndGetStreams(string url) {
        presentationUrl = url;
        GetAllStreams();
    }

    private async void GetAllStreams(){
        //TODO get all streams from server and set up their respective dependencies
        //TODO this means spawning screens and audio sources at the required positions and linking them to their respective streams
        //Streams should be assigned to screens like this (numbers indicating the number of the stream)
        // 0 1 2 3 4 - Row 0
        // 0 1 2 3 4 - Row 1
        // 0 1 2 3 4 - Row 2
        //2 being the middle right in front of the user and the other screens curving around the user
    }

    public void GoBackSeconds(float seconds = 10){
        timer -= seconds;
        //TODO update all streams to play at new time -> in stream call ChangedTimeForcefully
    }

    public void GoForwardSeconds(float seconds = 10){
        timer += seconds;
        //TODO update all streams to play at new time -> in stream call ChangedTimeForcefully
    }

    public void ResetPresentationToStart(){
        timer = 0;
        playing = false;
        //TODO update all streams to play at new time -> in stream call ChangedTimeForcefully with bool false
    }

    public void Reset() {
        //set evertything back to null or create new Lists
        presentationUrl = null;
        streams = new List<Stream>();
        timer = 0;
        playing = false;
    }

    
}

public class Stream {
    public List<MediaStreamData> mediaStreamData = new List<MediaStreamData>(3);
    //mediaStreamData is linked to a screen by its position in the list: 1 being the middle, 2 being top and 3 being bottom

    public Stream(List<MediaStreamData> mediaStreamData = null) {
        if (mediaStreamData != null) {
            this.mediaStreamData = mediaStreamData;
            foreach(var data in mediaStreamData) {
                data.streamIBelongTo = this;
            }
        }
    }

    public void PlayMediaAtTime(float timer) {
        foreach(var data in mediaStreamData) {
            //TODO check if hasTimeBeenChangedByUser is true and stop media, set videoplayers to new time and start them again
            data.TryPlayMedia(timer);
        }
    }

    public void ChangedTimeForcefully(bool startAfterwards = true) {
        //TODO stop all media, set their times and start them again
    }
}

public class MediaStreamData {
    public GameObject ScreenPrefab { get; set; }
    public GameObject AudioPrefab { get; set; }
    public Stream streamIBelongTo { get; set; }
    public Transform screenIBelongTo { get; set; }
    public MediaFile MediaFile { get; set; }
    public float StartTime { get; set; }
    public float EndTime { get; set; }

    private VideoPlayer videoPlayer;
    private AudioSource _audioSource;
    private Texture2D defaultTexture;
    private Texture2D videoTexture; //should be generated when initialized and set to videoPlayer.texture

    public MediaStreamData(MediaFile mediaFile, float startTime, float endTime) {
        this.MediaFile = mediaFile;
        this.StartTime = startTime;
        this.EndTime = endTime;
    }

    public void TryPlayMedia(float timer){
        //TODO if Mediafile is null, return
        //TODO if videoPlayer is not null, play video
        //TODO if _audioSource is not null, play audio
        //TODO check if this media was played in the last frame, if not initiate transition for showing screen
        //TODO set private timer to timer - startTime -> if timer < 0 or timer > endTime then return
        //TODO then reduce or increase videoplayer.time by that amount
    }

    private void ClearScreen()
    {
        if(videoPlayer is not null)
            if(videoPlayer.isPlaying)
                videoPlayer.Stop();

        if(_audioSource is not null)
            if(_audioSource.isPlaying)
                _audioSource.Stop();
    
        //TODO SetTexture(defaultTexture);
        //defaultTexture should be slightly transparent or completely clear
    }
}
