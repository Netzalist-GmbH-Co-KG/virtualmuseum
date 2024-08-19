using System.Collections;
using System.Collections.Generic;
using Oculus.Platform;
using TimeGlideVR.Server.Data;
using UnityEngine;

public class ConfigureBubble : MonoBehaviour
{
    private GameObject _cassettePrefab;
    [SerializeField]
    private GameObject insideBubbleReference;
    [SerializeField]
    private GameObject bubbleParentReference;

    private List<MediaFile> _mediaFiles = new List<MediaFile>();
    private string _cityName;

    private BubblePlacer bubblePlacerReference;

    public void Init(List<MediaFile> mediaFiles, string cityName, GameObject casettePrefab, BubblePlacer bubblePlacer)
    {
        _mediaFiles = mediaFiles;
        _cityName = cityName;
        _cassettePrefab = casettePrefab;
        bubblePlacerReference = bubblePlacer;
    }
    
    public void SpawnCassette(){
        if(_mediaFiles.Count <= 0) return;
        var cas = Instantiate(_cassettePrefab, insideBubbleReference.transform);
        cas.transform.localPosition = Vector3.zero;
        cas.GetComponent<Cassette>().Init(_mediaFiles, _cityName);
        bubblePlacerReference.PlaceBubble(bubbleParentReference.transform, cas);
        bubbleParentReference.SetActive(true);
    }
}
