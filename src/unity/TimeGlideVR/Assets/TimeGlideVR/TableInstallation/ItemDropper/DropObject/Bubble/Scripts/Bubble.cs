using System.Collections;
using System.Collections.Generic;
using Oculus.Platform;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.ItemDropper.Bubble.Scripts
{
    public class Bubble : MonoBehaviour
    {
        ParticleSystem _popParticles;
        MeshRenderer _meshRenderer;
        GameObject _bubbleObject;
        public GameObject ObjectInBubble { get; set; }
        Rigidbody _rbInBubble;
        [SerializeField]
        private List<AudioClip> popSounds = new();
        private AudioSource _audioSource;
        private bool _popped = false;

        void Awake(){
            _bubbleObject = transform.GetChild(0).gameObject;
            _rbInBubble = _bubbleObject.transform.GetChild(0).GetComponent<Rigidbody>();

            _meshRenderer = _bubbleObject.GetComponent<MeshRenderer>();
            _popParticles = _bubbleObject.GetComponent<ParticleSystem>();
            _audioSource = _bubbleObject.GetComponent<AudioSource>();   
        }

        public void SetObjectInBubble(){
            if(_bubbleObject.transform.GetChild(0).childCount > 0){
                ObjectInBubble = _bubbleObject.transform.GetChild(0)
                    .GetChild(0).gameObject;
                ObjectInBubble.transform.localPosition = Vector3.zero; //safety precaution if the Object hasnt been moved to the center yet
                ObjectInBubble.TryGetComponent<Rigidbody>(out var rb);
                if(rb){
                    rb.isKinematic = true;
                }
            }

            StartRotation();
        }

        void Update(){
            if(_popped) return;
            if(ObjectInBubble) ObjectInBubble.transform.localPosition = Vector3.zero;
            _rbInBubble.gameObject.transform.localPosition = Vector3.zero;
        }

        private void StartRotation(){
            if(!ObjectInBubble) return;
            if(ObjectInBubble.GetComponent<Rigidbody>()){
                ObjectInBubble.GetComponent<Rigidbody>().isKinematic = true;
            }
            StartCoroutine(RotateCenter());
        }

        IEnumerator RotateCenter() {
            while (true) {
                _rbInBubble.AddTorque(Random.Range(-0.3f,0.3f), Random.Range(-0.3f,0.3f), Random.Range(-0.3f,0.3f), ForceMode.Impulse);
                yield return new WaitForSeconds(Random.Range(0.5f, 2.5f));
            }
        }

        public void Pop(){
        
            //play animation and audio
            _popParticles.Play();
            _audioSource.PlayOneShot(popSounds[Random.Range(0, popSounds.Count)]);
            //disable outline
            _meshRenderer.materials = new List<Material>().ToArray();
            //disable bubble
            _popped = true;
            Destroy(gameObject, 2f);
        
            if(!ObjectInBubble) return;
            if(transform.parent){
                ObjectInBubble.transform.parent = transform.parent; // set the parent to the point on the map so the cassette can disappear with it
            } else {
                ObjectInBubble.transform.parent = null;
            }
            
            if(ObjectInBubble.GetComponent<Rigidbody>()){
                ObjectInBubble.GetComponent<Rigidbody>().isKinematic = false;
            }
        }
    }
}
