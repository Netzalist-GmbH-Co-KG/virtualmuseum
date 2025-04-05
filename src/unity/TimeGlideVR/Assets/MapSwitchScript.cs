using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using TimeGlideVR.TableInstallation.Table.Panel;
using TimeGlideVR.TableInstallation.Table.Panel.Button;

public class MapSwitchScript : MonoBehaviour
{
    [SerializeField] private AnimationCurve _sizeCurve;
    public UnityEvent<int> onSwitchComplete;

    public bool _isSwitching = false;
    private Coroutine _switchCoroutine;

    private void Awake()
    {
        _isSwitching = false;
    }

    public void SwitchBetweenObjectsSimple(GameObject _toDeactivate, GameObject _toActivate)
    {
        if (_isSwitching) return;
        _isSwitching = true;
        _toDeactivate.SetActive(false);
        _toActivate.SetActive(true);
        _isSwitching = false;
    }

    public void SwitchBetweenObjectsLerpSize(GameObject _toDeactivate, GameObject _toActivate, int buttonIndex = 0, float _duration = 2f)
    {
        _switchCoroutine = StartCoroutine(SwitchBetweenObjectsLerpSizeCoroutine(_toDeactivate, _toActivate, _duration, buttonIndex));
    }

    private IEnumerator SwitchBetweenObjectsLerpSizeCoroutine(GameObject _toDeactivate, GameObject _toActivate, float _duration, int buttonIndex = 0)
    {
        float time = 0f;
        _toDeactivate.SetActive(true);
        Vector3 startScaleDeactivate = _toDeactivate.transform.localScale;
        Vector3 startScaleActivate = _toActivate.transform.localScale;
        while (time < 1f)
        {
            time += Time.deltaTime / _duration;
            _toDeactivate.transform.localScale = Vector3.Lerp(startScaleDeactivate, Vector3.zero, _sizeCurve.Evaluate(time));
            yield return null;
        }
        
        _toDeactivate.SetActive(false);
        //make sure to rescale to original size to avoid lerp issues
        _toDeactivate.transform.localScale = startScaleDeactivate;
        _toActivate.transform.localScale = Vector3.zero;
        _toActivate.SetActive(true);
        time = 0f;
        while (time < 1f)
        {
            time += Time.deltaTime / _duration;
            _toActivate.transform.localScale = Vector3.Lerp(Vector3.zero, startScaleActivate, _sizeCurve.Evaluate(time));
            yield return null;
        }
        _isSwitching = false;
        _switchCoroutine = null;
        onSwitchComplete?.Invoke(buttonIndex);
    }
}
