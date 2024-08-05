using System;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.Video;

public class Video360 : MonoBehaviour
{
    [SerializeField] private VideoPlayer videoPlayer;
    [SerializeField] private GameObject videoScreen;
    private MeshRenderer _videoScreenRenderer;
    private Material _videoScreenMaterial;

    [SerializeField] private Texture imageTexture;
    [SerializeField] private Texture videoTexture;

    [SerializeField] private Transform center;
    private Transform player;

    private bool _playingVideo = false;
    private float _transparency = 1;


    private void Awake()
    {
        player = Camera.main!.transform;
        videoPlayer.errorReceived += (source, message) =>
        {
            Debug.LogError($"Video player error: {message}");
        };
        _videoScreenRenderer = videoScreen.GetComponent<MeshRenderer>();
        _videoScreenMaterial = _videoScreenRenderer.materials[0];
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


    public void ToggleContent()
    {
        try
        {
            if (!videoScreen.activeSelf) return;

            if (!_playingVideo && videoPlayer is not null)
            {
                SetTexture(videoTexture);
                videoPlayer.source = VideoSource.Url;
                videoPlayer.url = "https://timeglide-vr.b-cdn.net/Intro3.mp4";
                videoPlayer.time = 0;
                videoPlayer.Play();
                _playingVideo = true;
            }
            else
            {
                if (videoPlayer is not null)
                    videoPlayer.Stop();
                LoadImageFromUrl("https://timeglide-vr.b-cdn.net/IMG_20240609_110734_00_374.jpg");
                _playingVideo = false;
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Error toggling content: {e.Message}");
        }
    }

    private void LoadImageFromUrl(string url)
    {
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