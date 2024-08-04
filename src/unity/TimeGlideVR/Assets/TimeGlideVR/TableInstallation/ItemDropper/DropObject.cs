using System;
using JetBrains.Annotations;
using TMPro;
using UnityEngine;
using UnityEngine.Events;

namespace TimeGlideVR.TableInstallation.ItemDropper
{
    public class DropObject : MonoBehaviour
    {
        [SerializeField]
        UnityEvent uponHitTableEvent;
        private Rigidbody _rb;
        private Collider _col;
        private TextMeshPro _textMesh;
        private AudioSource _soundEffect;
    
        [CanBeNull] private string _collisionTag = null;
        private float _autoDespawnHeight = -1;
        private float _heightPercentage = 1.0f;
        private string _label = "";
        
        [SerializeField] private GameObject poleObject;
        [SerializeField] private GameObject labelObject;
        [SerializeField] private float distanceScaleFactor = 2.5f;

        public void Init(string label, [CanBeNull] string collisionTag, float autoDespawnHeight, float heightPercentage= 1.0f)
        {
            _label = label;
            _collisionTag = collisionTag;
            _heightPercentage = heightPercentage * distanceScaleFactor;
            _autoDespawnHeight = autoDespawnHeight;
            if(_textMesh is not null)
                _textMesh.text = _label;
            if(Math.Abs(_heightPercentage - 1.0f) > 0.05f)
                ResizeFlag();
        }
    
        void Update()
        {
            if (transform.position.y < _autoDespawnHeight)
            {
                Destroy(gameObject);
            }
        }
        
        void Awake()
        {
            _rb = GetComponentInChildren<Rigidbody>();
            _col = GetComponentInChildren<Collider>();
            _textMesh = GetComponentInChildren<TextMeshPro>();
            _soundEffect = GetComponent<AudioSource>();
            _rb.collisionDetectionMode = CollisionDetectionMode.Continuous;
            _rb.constraints = RigidbodyConstraints.FreezePositionX | RigidbodyConstraints.FreezePositionZ |
                              RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY |
                              RigidbodyConstraints.FreezeRotationZ;
        }
    
        void Start()
        {
            _textMesh.text = _label;
            if (Math.Abs(_heightPercentage - 1.0f) > 0.05f) return;
            ResizeFlag();
        }

        private void ResizeFlag()
        {
            var polePosition = poleObject.transform.localPosition;
            polePosition.y *= _heightPercentage;
            poleObject.transform.localPosition = polePosition;

            var poleScale = poleObject.transform.localScale;
            poleScale.y *= _heightPercentage;
            poleObject.transform.localScale = poleScale;

            var labelPosition = labelObject.transform.localPosition;
            labelPosition.y *= _heightPercentage;
            labelObject.transform.localPosition = labelPosition;
        }

        void OnCollisionEnter(Collision collision)
        {
            if(collision.gameObject.CompareTag("CollisionIgnore")) return;
            if (_collisionTag is not null && !collision.gameObject.CompareTag(_collisionTag)) return;
            
            if (_soundEffect != null)
            {
                if (_soundEffect.isPlaying)
                    _soundEffect.Stop();
                _soundEffect.Play();
            }

            uponHitTableEvent.Invoke();

            // Remove the Rigidbody and Collider components
            Destroy(_rb);
            Destroy(_col);
            // Optionally disable the script itself
            enabled = false;
        }
    }
}