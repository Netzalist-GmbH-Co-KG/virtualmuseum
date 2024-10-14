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
            LoadAnchorsFromDefaultLocalStorage();
        }

        public void Update()
        {
            if (!_anchorPlacementInProgress) return;
            if(_anchorPrefabTransform is null) return;
            
            // Verify that the right controller is connected (Admin mode)
            if (!OVRInput.IsControllerConnected(OVRInput.Controller.RTouch))
            {
                StopPlacement();
                return;
            }
        
            var rightControllerPosition = _cameraRig.rightControllerAnchor.position;
            _anchorPrefabTransform.position = new Vector3(rightControllerPosition.x, 0, rightControllerPosition.z);
            _anchorPrefabTransform.rotation = Quaternion.Euler(0, _cameraRig.rightControllerAnchor.rotation.eulerAngles.y, 0);
        }

        private GameObject AnchorPrefab => anchorPrefab;

        public void LoadAnchorsFromDefaultLocalStorage()
        {
            Debug.Log($"Loading anchors from local storage");
            StopPlacement();
            var uuids = _spatialAnchorLocalStorageManager.GetAnchorAnchorUuidFromLocalStorage();
            Debug.Log($"Loaded {uuids?.Count} anchors from local storage");
            if (uuids == null) return;
            spatialAnchorCore.LoadAndInstantiateAnchors(AnchorPrefab, uuids);
            Debug.Log($"Instantiated {uuids.Count} anchors from local storage");
        }

        private void StartPlacement()
        {
            EraseAllAnchors();
            Debug.Log("Starting placement");
            if (_anchorPrefabTransform) Destroy(_anchorPrefabTransform.gameObject);
            _anchorPrefabTransform = Instantiate(AnchorPrefab).transform;
            _anchorPlacementInProgress = true;
        }
        
        public void EraseAllAnchors()
        {
            if (!OVRInput.IsControllerConnected(OVRInput.Controller.RTouch))
            {
                return;
            }
            Debug.Log("Erasing all anchors");
            StopPlacement();
            _spatialAnchorLocalStorageManager.Reset();
            spatialAnchorCore.EraseAllAnchors();
            Debug.Log("Erased all anchors");
        }

        private void StopPlacement()
        {
            if (_anchorPrefabTransform is null) return;
            Debug.Log("Stopping placement. Destroying anchor prefab.");
            Destroy(_anchorPrefabTransform.gameObject);
            _anchorPrefabTransform = null;
            _anchorPlacementInProgress = false;
        }
    
        /// <summary>
        /// Starts and stops the placement of the anchor prefab and spanws the prefab at the current position.
        /// </summary>
        public void TogglePlacement()
        {
            if (!OVRInput.IsControllerConnected(OVRInput.Controller.RTouch))
            {
                return;
            }
            if (_anchorPlacementInProgress)
            {
                Debug.Log("Stopping placement. Creating fixes object.");
                spatialAnchorCore.InstantiateSpatialAnchor(anchorPrefab, _anchorPrefabTransform.position, _anchorPrefabTransform.rotation);
                StopPlacement();
            }
            else
            {
                Debug.Log("Starting placement");
                StartPlacement();
            }
        }
    }
}