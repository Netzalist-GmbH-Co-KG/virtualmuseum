using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AnimationEventWrapper : MonoBehaviour
{
    [SerializeField] private Animation anim;
    [SerializeField] private TableCoordinates tableCoordinates;
    [SerializeField] private AudioClip tableRiseClip;
    [SerializeField] private AudioClip hydraulicSoundClip;

    public void PlayAnimation()
    {
        anim.Play();
    }

    public void StartTableCoordinates()
    {
        tableCoordinates.Begin();
    }

    public void PlayTableRise()
    {
        GetComponent<AudioSource>().PlayOneShot(hydraulicSoundClip);
        GetComponent<AudioSource>().PlayOneShot(tableRiseClip);
    }

    public void PlayParticleEffects(){

        GetComponent<ParticleSystem>().Play();
    }
    
}
