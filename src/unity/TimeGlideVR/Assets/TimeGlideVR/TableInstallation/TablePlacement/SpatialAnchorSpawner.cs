using Meta.XR.BuildingBlocks;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.TablePlacement
{
    public class SpatialAnchorSpawner : MonoBehaviour
    {
        [SerializeField]
        private GameObject anchorPrefab;

        [SerializeField]
        private SpatialAnchorCoreBuildingBlock spatialAnchorCore;
        private SpatialAnchorLocalStorageManager _spatialAnchorLocalStorageManager;
        private OVRCameraRig _cameraRig;
        private Transform _anchorPrefabTransform;
        private Vector3 _initialPosition;
        private Quaternion _initialRotation;

        private bool _anchorPlacementInProgress;

        private void Awake()
        {
            _cameraRig = FindAnyObjectByType<OVRCameraRig>();
            _spatialAnchorLocalStorageManager = GetComponent<SpatialAnchorLocalStorageManager>();
            AnchorPrefab = anchorPrefab;
            if (OVRInput.GetConnectedControllers() != OVRInput.Controller.RTouch)
            {
                LoadAnchorsFromDefaultLocalStorage();
            }

        }

        public void Update()
        {
            if (!_anchorPlacementInProgress) return;
            if(_anchorPrefabTransform is null) return;
            
            // Verify that the right controller is connected (Admin mode)
            if (OVRInput.GetConnectedControllers() != OVRInput.Controller.RTouch)
            {
                StopPlacement();
                return;
            }
        
            var rightControllerPosition = _cameraRig.rightControllerAnchor.position;
            _anchorPrefabTransform.position = new Vector3(rightControllerPosition.x, 0, rightControllerPosition.z);
            _anchorPrefabTransform.rotation = Quaternion.Euler(0, _cameraRig.rightControllerAnchor.rotation.eulerAngles.y, 0);
        }

        private GameObject AnchorPrefab
        {
            get => anchorPrefab;
            set
            {
                anchorPrefab = value;
                TogglePlacement();
            }
        }
        
        public void LoadAnchorsFromDefaultLocalStorage()
        {
            StopPlacement();
            var uuids = _spatialAnchorLocalStorageManager.GetAnchorAnchorUuidFromLocalStorage();
            if (uuids == null) return;
            spatialAnchorCore.LoadAndInstantiateAnchors(AnchorPrefab, uuids);
        }

        private void StartPlacement()
        {
            StopPlacement();
            spatialAnchorCore.EraseAllAnchors();
            if (_anchorPrefabTransform) Destroy(_anchorPrefabTransform.gameObject);
            _anchorPrefabTransform = Instantiate(AnchorPrefab).transform;
            var tableLift = _anchorPrefabTransform.GetComponentInChildren<Lift.Lift>();
            if (tableLift)
            {
                tableLift.ToggleLift();
            }
            _anchorPlacementInProgress = true;
        }

        private void StopPlacement()
        {
            if (_anchorPrefabTransform is null) return;
            Destroy(_anchorPrefabTransform.gameObject);
            _anchorPrefabTransform = null;
            _anchorPlacementInProgress = false;
        }
    
        /// <summary>
        /// Starts and stops the placement of the anchor prefab and spanws the prefab at the current position.
        /// </summary>
        public void TogglePlacement()
        {
            // Verify that the right controller is connected
            if(OVRInput.GetConnectedControllers() != OVRInput.Controller.RTouch) return;

            if (_anchorPlacementInProgress)
            {
                spatialAnchorCore.InstantiateSpatialAnchor(anchorPrefab, _anchorPrefabTransform.position, _anchorPrefabTransform.rotation);
                StopPlacement();
            }
            else
            {
                StartPlacement();
            }
        }
    }
}