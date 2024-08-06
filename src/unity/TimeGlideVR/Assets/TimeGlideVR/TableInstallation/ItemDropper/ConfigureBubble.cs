using System.Collections;
using System.Collections.Generic;
using Oculus.Platform;
using TimeGlideVR.Server.Data;
using UnityEngine;

public class ConfigureBubble : MonoBehaviour
{
    [SerializeField]
    GameObject _cassettePrefab;
    [SerializeField]
    GameObject insideBubbleReference;
    [SerializeField]
    GameObject bubbleParentReference;

    private List<MediaFile> _mediaFiles = new List<MediaFile>();
    private string _cityName;

    public void Init(List<MediaFile> mediaFiles, string cityName)
    {
        _mediaFiles = mediaFiles;
        _cityName = cityName;
    }
    
    public void SpawnCassette(){
        if(_mediaFiles.Count <= 0) return;
        var cas = Instantiate(_cassettePrefab, insideBubbleReference.transform);
        cas.transform.localPosition = Vector3.zero;
        cas.GetComponent<Cassette>().Init(_mediaFiles, _cityName);
        bubbleParentReference.SetActive(true);
    }
}
