using System;
using System.Collections.Generic;
using TimeGlideVR.Server.Data;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.Video;

public class Video360 : MonoBehaviour
{
    [SerializeField] private VideoPlayer videoPlayer;
    [SerializeField] private GameObject videoScreen;
    [SerializeField] private TextMeshPro currentMediaText;
    [SerializeField] private TextMeshPro nextMediaText;
    [SerializeField] private Texture defaultTexture;

    private AudioSource _audioSource;
    private MeshRenderer _videoScreenRenderer;
    private Material _videoScreenMaterial;

    private List<MediaFile> _mediaFiles = new List<MediaFile>();
    private MediaFile _currentMediaFile;

    [SerializeField] private Texture imageTexture;
    [SerializeField] private Texture videoTexture;

    [SerializeField] private Transform center;
    private Transform player;

    private MediaTypeUnityEvents _mediaTypeUnityEvents;

    private bool _playingVideo = false;
    private float _transparency = 1;

    private void Awake()
    {
        player = Camera.main!.transform;
        videoPlayer.errorReceived += (source, message) => { Debug.LogError($"Video player error: {message}"); };
        _videoScreenRenderer = videoScreen.GetComponent<MeshRenderer>();
        _videoScreenMaterial = _videoScreenRenderer.materials[0];

        _mediaTypeUnityEvents = FindObjectOfType<MediaTypeUnityEvents>(true);
        if (_mediaTypeUnityEvents is null) throw new Exception("Media Type Unity Events not found");

        _audioSource = GetComponent<AudioSource>();
        
        _mediaTypeUnityEvents.ThreeSixtyImageEvent.AddListener(HandleMediaEvent);
        _mediaTypeUnityEvents.ThreeSixtyVideoEvent.AddListener(HandleMediaEvent);
        _mediaTypeUnityEvents.DefaultImageEvent.AddListener(HandleMediaEvent);
        _mediaTypeUnityEvents.DefaultAudioEvent.AddListener(HandleMediaEvent);
        _mediaTypeUnityEvents.ResetMediaEvent.AddListener(ResetMedia);
    }

    private void ClearScreen()
    {
        if(videoPlayer is not null)
            if(videoPlayer.isPlaying)
                videoPlayer.Stop();
   
        if(_audioSource is not null)
            if(_audioSource.isPlaying)
                _audioSource.Stop();
        
        SetTexture(defaultTexture);
    }
    
    private void ResetMedia()
    {
        Debug.Log($"Resetting media");
        _currentMediaFile = null;
        if(currentMediaText is not null)
            currentMediaText.text = "";
        if(nextMediaText is not null)
            nextMediaText.text = "";
        if(videoPlayer is not null)
            videoPlayer.Stop();
        _playingVideo = false;
        _mediaFiles.Clear();
        ClearScreen();
    }

    public void Update()
    {
        if (player is null) return;
        var horizontalDistanceOfPlayerFromCenter = Vector3.Distance(
            new Vector3(player.position.x, 0, player.position.z), new Vector3(center.position.x, 0, center.position.z));
        if (horizontalDistanceOfPlayerFromCenter > 3)
        {
            if (videoPlayer is not null)
                videoPlayer.Stop();
            // 90% transparency
            _transparency = 0.4f;
        }
        else if (horizontalDistanceOfPlayerFromCenter is < 3 and > 1)
        {
            // gradually increase transparency from 90% to 0%
            _transparency = 0.4f + (3 - horizontalDistanceOfPlayerFromCenter) * 0.3f;
        }
        else
        {
            // 0% transparency
            _transparency = 1;
        }

        SetTransparency();
    }

    private void SetTransparency()
    {
        if (!videoScreen.activeSelf) return;
        var color = _videoScreenMaterial.color;
        color.a = _transparency;
        _videoScreenMaterial.color = color;
    }


    private void Start()
    {
        // ToggleVisible();
        // ToggleContent();
    }

    private void SetTexture(Texture texture)
    {
        _videoScreenMaterial.mainTexture = texture;
    }

    private void HandleMediaEvent(MediaFile file)
    {
        Debug.Log($"Handling media event: {file.Name} / {file.Type}");
        _mediaFiles.Add(file);
        if (_currentMediaFile is not null)
        {
            DisplayLabel();
            return;
        };

        _currentMediaFile = file;
        DisplayCurrentMedia();
    }

    private void DisplayCurrentMedia()
    {
        if (_currentMediaFile is null)
        {
            ClearScreen();
            return;
        }
        switch (_currentMediaFile.Type?.ToLowerInvariant())
        {
            case "2djpg":
                LoadImageFromUrl(_currentMediaFile.Url);
                break;
            case "3djpg":
                LoadImageFromUrl(_currentMediaFile.Url);
                break;
            case "3dmp4":
                LoadVideoFromUrl(_currentMediaFile.Url);
                break;
            case "audio":
                LoadAudioFromUrl(_currentMediaFile.Url);
                break;
            default:
                return;
        }

        DisplayLabel();
    }

    private void LoadAudioFromUrl(string url)
    {
        if(_audioSource is null) return;
        if(_audioSource.isPlaying)
            _audioSource.Stop();
        if(videoPlayer is not null)
            if(videoPlayer.isPlaying)
                videoPlayer.Stop();
        var request = UnityWebRequestMultimedia.GetAudioClip(url, AudioType.MPEG);
        
        request.SendWebRequest().completed += _ =>
        {
            try
            {
                if (request.responseCode == 200)
                {
                    var audioClip = DownloadHandlerAudioClip.GetContent(request);
                    _audioSource.clip = audioClip;
                    _audioSource.Play();
                }
                else
                {
                    Debug.LogError($"Failed to load audio from URL [Error {request.responseCode}]: {url}");
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Error loading audio from URL: {e.Message}");
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

    public void ToggleContent()
    {
        try
        {
            if (_mediaFiles.Count == 0) return;
            if (_currentMediaFile is null)
            {
                _currentMediaFile = _mediaFiles[0];
            }
            else
            {
                if (_mediaFiles.Count == 1) return;
                var index = _mediaFiles.IndexOf(_currentMediaFile);
                index = (index + 1) % _mediaFiles.Count;
                _currentMediaFile = _mediaFiles[index];
            }

            DisplayCurrentMedia();
        }
        catch (Exception e)
        {
            Debug.LogError($"Error toggling content: {e.Message}");
        }
    }


    private void LoadVideoFromUrl(string url)
    {
        Debug.Log($"Loading video from URL: {url}");

        if(_audioSource is not null)
            if(_audioSource.isPlaying)
                _audioSource.Stop();
        
        if (_playingVideo || videoPlayer is null) return;
        SetTexture(videoTexture);
        videoPlayer.source = VideoSource.Url;
        videoPlayer.url = url;
        videoPlayer.time = 0;
        videoPlayer.Play();
        _playingVideo = true;
    }

    private void LoadImageFromUrl(string url)
    {
        Debug.Log($"Loading image from URL: {url}");
        if (videoPlayer is not null)
            videoPlayer.Stop();
        _playingVideo = false;

        var request = UnityWebRequestTexture.GetTexture(url);
        request.SendWebRequest().completed += _ =>
        {
            try
            {
                if (request.responseCode == 200)
                {
                    var texture = DownloadHandlerTexture.GetContent(request);
                    SetTexture(texture);
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

    public void ToggleVisible()
    {
        if (videoPlayer is not null)
            videoPlayer.Stop();
        videoScreen.SetActive(!videoScreen.activeSelf);
    }
}