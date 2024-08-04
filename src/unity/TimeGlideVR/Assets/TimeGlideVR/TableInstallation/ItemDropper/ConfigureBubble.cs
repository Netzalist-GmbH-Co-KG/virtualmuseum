using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ConfigureBubble : MonoBehaviour
{
    [SerializeField]
    GameObject _cassettePrefab;
    [SerializeField]
    GameObject insideBubbleReference;
    [SerializeField]
    GameObject bubbleParentReference;

    public void SpawnCassette(){
        var cas = Instantiate(_cassettePrefab, insideBubbleReference.transform);
        cas.transform.localPosition = Vector3.zero;
        bubbleParentReference.SetActive(true);
    }
}
