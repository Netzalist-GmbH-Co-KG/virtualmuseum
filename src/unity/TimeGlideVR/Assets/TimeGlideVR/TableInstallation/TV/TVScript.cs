using System;
using System.Collections.Generic;
using TimeGlideVR.Server.Data.Media;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;

public class TVScript : MonoBehaviour
{
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
    void Start()
    {
        Debug.Log("TVScript SlideUp");
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
    
    private void HandleMediaEvent(PresentationItem item)
    {
        if(item.SlotNumber != slotNumber) return;

        _currentMediaFile = item.MediaFile;
        DisplayCurrentMedia();
    }    
    
    private void DisplayCurrentMedia()
    {
        if (_currentMediaFile is null)
        {
            HideScreen();
            return;
        }
        switch (_currentMediaFile.Type)
        {
            case MediaType.Image2D:
                Debug.Log("360: Ignoring 2djpg media type");
                ShowImage(_currentMediaFile);
                break;
            default:
                HideScreen();
                return;
        }
        DisplayLabel();
    }
    
    private void HideScreen()
    {
        _tvScreenMaterial.mainTexture = null;
        fullInstallation.SetActive(false);
    }

    private void ShowVideo(MediaFile arg0)
    {
        Debug.Log("TV: Showing Video");
    }

    private void ShowImage(MediaFile mediaFile)
    {
        Debug.Log("TV: Showing Image");
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
