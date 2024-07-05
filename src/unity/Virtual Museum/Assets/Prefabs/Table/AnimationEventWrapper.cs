using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AnimationEventWrapper : MonoBehaviour
{
    [SerializeField] private Animation anim;
    [SerializeField] private TableCoordinates tableCoordinates;

    public void PlayAnimation()
    {
        anim.Play();
    }

    public void StartTableCoordinates()
    {
        tableCoordinates.Begin();
    }
}
