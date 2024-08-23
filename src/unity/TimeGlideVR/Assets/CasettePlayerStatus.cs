using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CasettePlayerStatus : MonoBehaviour
{
    private readonly Vector3 _closedPosition= new Vector3(0.0f, 0.4451774f, 0.02627331f);
    private readonly Vector3 _closedRotation = new Vector3(-90f, 0f, 180f);
    private readonly Vector3 _openPosition = new Vector3(0.0f, 0.379f, -0.153f);
    private readonly Vector3 _openRotation = new Vector3(-127.333f, 0f, 180f);

    [SerializeField]
    private Transform lid;

    public void Open()
    {
        lid.localPosition = _openPosition;
        lid.localEulerAngles = _openRotation;
        Debug.Log("CasettePlayerStatus Open");
    }
    public void Close()
    {
        lid.localPosition = _closedPosition;
        lid.localEulerAngles = _closedRotation;
        Debug.Log("CasettePlayerStatus Closed");
    }

}
