using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapSwitchTest : MonoBehaviour
{
    [SerializeField] private MapSwitchScript _mapSwitchScript;
    [SerializeField] private GameObject _toDeactivate;
    [SerializeField] private GameObject _toActivate;

    private IEnumerator SwitchBackAndForthCoroutine()
    {
        while (true)
        {
            _mapSwitchScript.SwitchBetweenObjectsLerpSize(_toDeactivate, _toActivate);
            yield return new WaitForSeconds(4f);
            _mapSwitchScript.SwitchBetweenObjectsLerpSize(_toActivate, _toDeactivate);
            yield return new WaitForSeconds(4f);
        }
    }

    private void Start()
    {
        StartCoroutine(SwitchBackAndForthCoroutine());
    }
}
