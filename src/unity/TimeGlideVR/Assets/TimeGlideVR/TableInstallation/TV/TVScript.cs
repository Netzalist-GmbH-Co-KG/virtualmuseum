using System;
using System.Collections.Generic;
using JetBrains.Annotations;
using Oculus.Platform;
using TimeGlideVR.Server.Data.Media;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.Video;

public class TVScript : MonoBehaviour
{
    [SerializeField] private VideoPlayer videoPlayer;
    [SerializeField] private Texture videoTexture;
    [SerializeField]
    private int slotNumber;
    [SerializeField]
    private GameObject fullInstallation; 
    [SerializeField]
    private GameObject tvScreen;
    [SerializeField] private TextMeshPro currentMediaText;
    [SerializeField] private TextMeshPro nextMediaText;

    private MediaTypeUnityEvents _mediaTypeUnityEvents;
    private MeshRenderer _tvScreenRenderer;
    private Material _tvScreenMaterial;

    private List<MediaFile> _mediaFiles = new List<MediaFile>();
    private MediaFile _currentMediaFile;
    private bool _playingVideo = false;
    
    private void Awake()
    {
        videoPlayer.errorReceived += (source, message) => { Debug.LogError($"Video player error: {message}"); };

    }

    void Start()
    {
        try
        {
            _mediaTypeUnityEvents = FindObjectOfType<MediaTypeUnityEvents>(true);
            _mediaTypeUnityEvents.DefaultImageEvent.AddListener(HandleMediaEvent);
            _mediaTypeUnityEvents.DefaultVideoEvent.AddListener(HandleMediaEvent);
            _mediaTypeUnityEvents.DisplayMedia.AddListener(HandleMediaEvent);
            _mediaTypeUnityEvents.ResetMediaEvent.AddListener(() =>
            {
                _mediaFiles.Clear();
                _currentMediaFile = null;
                DisplayCurrentMedia();
            });
        
            _tvScreenRenderer = tvScreen.GetComponent<MeshRenderer>();
            _tvScreenMaterial = _tvScreenRenderer.materials[0];
        }
        catch (Exception e)
        {
            Debug.LogError(e);
        }
    }

    private void HandleMediaEvent(MediaFile file)
    {
        Debug.Log($"TV: Handling media event: {file.Name} / {file.Type}");
        _mediaFiles.Add(file);
        if (_currentMediaFile is not null)
        {
            return;
        }

        _currentMediaFile = file;
        DisplayCurrentMedia();
    }
    
    private void HandleMediaEvent(int slot, [CanBeNull] PresentationItem item)
    {
        if(slot!=slotNumber) return;
        _currentMediaFile = item?.MediaFile;
        Debug.Log($"TV: Handling media event: {_currentMediaFile?.Name} / {item.SlotNumber}");
        DisplayCurrentMedia();
    }    
    
    private void DisplayCurrentMedia()
    {
        if (_currentMediaFile is null || string.IsNullOrEmpty(_currentMediaFile.Url))
        {
            Debug.Log($"TV: Hiding screen {slotNumber}");
            HideScreen();
            return;
        }
        switch (_currentMediaFile.Type)
        {
            case MediaType.Image2D:
                LoadImageFromUrl(_currentMediaFile);
                break;
            case MediaType.Video2D:
                LoadVideoFromUrl(_currentMediaFile);
                break;
            default:
                HideScreen();
                return;
        }
        DisplayLabel();
    }
    
    private void HideScreen()
    {
        if(videoPlayer is not null)
            if(videoPlayer.isPlaying)
                videoPlayer.Stop();

        _tvScreenMaterial.mainTexture = null;
        fullInstallation.SetActive(false);
    }

    private void LoadVideoFromUrl(MediaFile mediaFile)
    {
        Debug.Log($"Loading video from URL: {mediaFile.Url}");

        if (_playingVideo || videoPlayer is null) return;
        fullInstallation.SetActive(true);
        _tvScreenMaterial.mainTexture = videoTexture;
        videoPlayer.source = VideoSource.Url;
        videoPlayer.url = mediaFile.Url;
        videoPlayer.time = 0;
        videoPlayer.Play();
        _playingVideo = true;
    }

    private void LoadImageFromUrl(MediaFile mediaFile)
    {
        Debug.Log($"TV: Showing Image: {mediaFile.Name} on screen {slotNumber}"); 
        if (videoPlayer is not null)
            videoPlayer.Stop();
        _playingVideo = false;
        fullInstallation.SetActive(true);
        
        var url = mediaFile.Url;
        Debug.Log($"Loading Image from URL: {url}");

        var request = UnityWebRequestTexture.GetTexture(url);
        request.SendWebRequest().completed += _ =>
        {
            try
            {
                if (request.responseCode == 200)
                {
                    var texture = DownloadHandlerTexture.GetContent(request);
                    _tvScreenMaterial.mainTexture = texture;
                }
                else
                {
                    Debug.LogError($"Failed to load image from URL [Error {request.responseCode}]: {url}");
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Error loading image from URL: {e.Message}");
            }
        };
    }
    
    private void DisplayLabel()
    {
        if (currentMediaText is null) return;

        if (_currentMediaFile is not null)
            currentMediaText.text = _currentMediaFile.Name;
        else
            currentMediaText.text = "";

        if (nextMediaText is null) return;
        if (_mediaFiles.Count > 1)
        {
            var currentIndex = _mediaFiles.IndexOf(_currentMediaFile);
            var nextIndex = (currentIndex + 1) % _mediaFiles.Count;
            nextMediaText.text = _mediaFiles[nextIndex].Name;
        }
        else
        {
            nextMediaText.text = "";
        }
    }
}
