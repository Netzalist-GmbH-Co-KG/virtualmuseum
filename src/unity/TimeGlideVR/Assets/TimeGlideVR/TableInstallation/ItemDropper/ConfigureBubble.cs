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

    public void Init(List<MediaFile> mediaFiles)
    {
        _mediaFiles = mediaFiles;
    }
    
    public void SpawnCassette(){
        var cas = Instantiate(_cassettePrefab, insideBubbleReference.transform);
        cas.transform.localPosition = Vector3.zero;
        cas.GetComponent<Cassette>().Init(_mediaFiles);
        bubbleParentReference.SetActive(true);
    }
}
