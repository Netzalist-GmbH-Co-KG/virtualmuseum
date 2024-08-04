using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class PlaySoundOnCollide : MonoBehaviour
{
    [SerializeField]
    UnityEvent collisionEvent;
    [SerializeField]
    AudioSource audioSource;
    [SerializeField]
    List<AudioClip> audioClips;
    private void OnCollisionEnter(Collision other) {
        collisionEvent.Invoke();
        audioSource.PlayOneShot(audioClips[Random.Range(0, audioClips.Count)]);
    }
}
