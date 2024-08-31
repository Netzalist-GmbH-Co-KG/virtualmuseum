using System.Collections;
using System.Collections.Generic;
using TimeGlideVR.Server.Data;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Video;

public class PresentationMediaManager : MonoBehaviour
{
    [SerializeField] private GameObject screenPrefab;
    [SerializeField] private GameObject audioPrefab;
    [SerializeField] private UnityEvent<string> startStreamEvent;
    [SerializeField] private List<Stream> streams = new List<Stream>();
    [SerializeField] private string presentationUrl;
    [SerializeField] private bool isPlaying = false;
    private float timer = 0;
    public bool started = false;


    private void Update() {
        //increment timer and call PlayMediaAtTime on all streams with given timer
        if(!started) return;
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
        // 5 3 1 2 4
        //     ^
        //this being the middle right in front of the user and the other screens curving around the user
    }

    public void GoBackSeconds(float seconds = 10){
        timer -= seconds;
        //TODO update all streams to play at new time -> bool to tell all streams that time has been changed and players should be updated
    }

    public void GoForwardSeconds(float seconds = 10){
        timer += seconds;
        //TODO update all streams to play at new time -> bool to tell all streams that time has been changed and players should be updated
    }

    public void ResetPresentationToStart(){
        timer = 0;
        started = false;
        //TODO update all streams to play at new time -> bool to tell all streams that time has been changed and players should be updated
    }

    public void Reset() {
        //set evertything back to null or create new Lists
        presentationUrl = null;
        streams = new List<Stream>();
        timer = 0;
        started = false;
    }

    
}

public class Stream {
    public List<MediaStreamData> mediaStreamDatas = new List<MediaStreamData>();
    private bool hasTimeBeenChangedByUser = false;

    public Stream(List<MediaStreamData> mediaStreamDatas = null) {
        if (mediaStreamDatas != null) {
            this.mediaStreamDatas = mediaStreamDatas;
            foreach(var mediaStreamData in mediaStreamDatas) {
                mediaStreamData.streamIBelongTo = this;
            }
        }
    }

    public void PlayMediaAtTime(float timer) {
        foreach(var mediaStreamData in mediaStreamDatas) {
            //TODO check if hasTimeBeenChangedByUser is true and stop media, set videoplayers to new time and start them again
            mediaStreamData.TryPlayMedia(timer);
        }
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
