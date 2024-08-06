using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Video;

public class Video2D : MonoBehaviour
{
    [SerializeField]
    private VideoPlayer videoPlayer;
    private bool _playingVideo = false;
    [SerializeField]
    private Texture videoTexture;
    public void LoadVideoFromUrl(string url){
        if (_playingVideo || videoPlayer is null) return;
        SetTexture(videoTexture);
        videoPlayer.source = VideoSource.Url;
        videoPlayer.url = url;
        videoPlayer.time = 0;
        videoPlayer.Play();
        _playingVideo = true;
    }

    public void LoadImageFromUrl(string url)
    {
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
}
