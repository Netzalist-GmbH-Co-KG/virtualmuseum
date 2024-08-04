using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bubble : MonoBehaviour
{
    ParticleSystem PopParticles;
    MeshRenderer meshRenderer;
    GameObject bubbleObject;
    [HideInInspector]
    public GameObject ObjectInBubble;
    Rigidbody rbInBubble;
    [SerializeField]
    private List<AudioClip> popSounds = new List<AudioClip>();
    private AudioSource audioSource;
    private bool popped = false;

    void Start(){
        //set up
        bubbleObject = transform.GetChild(0).gameObject;
        rbInBubble = bubbleObject.transform.GetChild(0).GetComponent<Rigidbody>();
        if(bubbleObject.transform.GetChild(0).childCount > 0){
            ObjectInBubble = bubbleObject.transform.GetChild(0) //InsideBubble Object
            .GetChild(0).gameObject; //child of InsideBubble
            ObjectInBubble.transform.localPosition = Vector3.zero; //safety precaution if the Object hasnt been moved to the center yet
            ObjectInBubble.TryGetComponent<Rigidbody>(out var rb);
            if(rb){
                rb.isKinematic = true;
            }
        }
            
        
        meshRenderer = bubbleObject.GetComponent<MeshRenderer>();
        PopParticles = bubbleObject.GetComponent<ParticleSystem>();
        audioSource = bubbleObject.GetComponent<AudioSource>();
        MoveBubble();
    }

    void Update(){
        if(popped) return;
        if(ObjectInBubble) ObjectInBubble.transform.localPosition = Vector3.zero;
        rbInBubble.gameObject.transform.localPosition = Vector3.zero;
    }

    public void MoveBubble(){
        if(!ObjectInBubble) return;
        if(ObjectInBubble.GetComponent<Rigidbody>()){
            ObjectInBubble.GetComponent<Rigidbody>().isKinematic = true;
        }
        StartCoroutine(RotateCenter());
    }

    IEnumerator RotateCenter() {
        while (true) {
            rbInBubble.AddTorque(Random.Range(-0.3f,0.3f), Random.Range(-0.3f,0.3f), Random.Range(-0.3f,0.3f), ForceMode.Impulse);
            yield return new WaitForSeconds(Random.Range(0.5f, 2.5f));
        }
    }
    //bubble should pop
    public void Pop(){
        
        //play animation and audio
        PopParticles.Play();
        audioSource.PlayOneShot(popSounds[Random.Range(0, popSounds.Count)]);
        //disable outline
        meshRenderer.materials = new List<Material>().ToArray();
        //disable bubble
        popped = true;
        Destroy(gameObject, 2f);
        
        if(!ObjectInBubble) return;
        ObjectInBubble.transform.parent = null;
        if(ObjectInBubble.GetComponent<Rigidbody>()){
            ObjectInBubble.GetComponent<Rigidbody>().isKinematic = false;
        }
    }
}
