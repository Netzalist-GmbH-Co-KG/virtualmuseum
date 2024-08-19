/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * Licensed under the Oculus SDK License Agreement (the "License");
 * you may not use the Oculus SDK except in compliance with the License,
 * which is provided at the time of installation or download, or which
 * otherwise accompanies this software in either electronic or hard copy form.
 *
 * You may obtain a copy of the License at
 *
 * https://developer.oculus.com/licenses/oculussdk/
 *
 * Unless required by applicable law or agreed to in writing, the Oculus SDK
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

using System;
using System.Collections.Generic;
using Meta.XR.BuildingBlocks;
using UnityEngine;
using UnityEngine.Serialization;

namespace TimeGlideVR.TableInstallation.TablePlacement
{
    /// <summary>
    /// Anchor's uuid on local storage manager.
    /// </summary>
    public class SpatialAnchorLocalStorageManager : MonoBehaviour
    {
        [FormerlySerializedAs("_spatialAnchorCore")] [SerializeField]
        private SpatialAnchorCoreBuildingBlock spatialAnchorCore;
        private readonly List<Guid> _uuids = new ();

        private const string NumUuidsPlayerPref = "numUuids";

        private void Start()
        {
            spatialAnchorCore.OnAnchorCreateCompleted.AddListener(SaveAnchorUuidToLocalStorage);
            spatialAnchorCore.OnAnchorEraseCompleted.AddListener(RemoveAnchorFromLocalStorage);
        }

        public void SaveAnchorUuidToLocalStorage(OVRSpatialAnchor anchor, OVRSpatialAnchor.OperationResult result)
        {
            Debug.Log($"[{nameof(SpatialAnchorLocalStorageManager)}] SaveAnchorUuidToLocalStorage: {anchor.Uuid} {result}");
            if (result != OVRSpatialAnchor.OperationResult.Success)
            {
                return;
            }

            if (!PlayerPrefs.HasKey(NumUuidsPlayerPref))
            {
                PlayerPrefs.SetInt(NumUuidsPlayerPref, 0);
            }

            int playerNumUuids = PlayerPrefs.GetInt(NumUuidsPlayerPref);
            PlayerPrefs.SetString("uuid" + playerNumUuids, anchor.Uuid.ToString());
            PlayerPrefs.SetInt(NumUuidsPlayerPref, ++playerNumUuids);
        }

        internal void RemoveAnchorFromLocalStorage(OVRSpatialAnchor anchor, OVRSpatialAnchor.OperationResult result)
        {
            var uuid = anchor.Uuid;
            if (result == OVRSpatialAnchor.OperationResult.Failure)
                return;

            var playerUuidCount = PlayerPrefs.GetInt(NumUuidsPlayerPref, 0);
            for (int i = 0; i < playerUuidCount; i++)
            {
                var key = "uuid" + i;
                var value = PlayerPrefs.GetString(key, "");
                if (value.Equals(uuid.ToString()))
                {
                    var lastKey = "uuid" + (playerUuidCount - 1);
                    var lastValue = PlayerPrefs.GetString(lastKey);
                    PlayerPrefs.SetString(key, lastValue);
                    PlayerPrefs.DeleteKey(lastKey);

                    playerUuidCount--;
                    if (playerUuidCount < 0) playerUuidCount = 0;
                    PlayerPrefs.SetInt(NumUuidsPlayerPref, playerUuidCount);
                    break;
                }
            }
        }

        /// <summary>
        /// Load spatial anchors stored in local storage.
        /// </summary>
        internal List<Guid> GetAnchorAnchorUuidFromLocalStorage()
        {
            // Get number of saved anchor uuids
            if (!PlayerPrefs.HasKey(NumUuidsPlayerPref))
            {
                Reset();
                Debug.Log($"[{nameof(SpatialAnchorLocalStorageManagerBuildingBlock)}] Anchor not found.");
                return null;
            }

            // Load unbounded anchors
            _uuids.Clear();
            var playerUuidCount = PlayerPrefs.GetInt(NumUuidsPlayerPref);
            for (int i = 0; i < playerUuidCount; ++i)
            {
                var uuidKey = "uuid" + i;
                if (!PlayerPrefs.HasKey(uuidKey))
                    continue;

                var currentUuid = PlayerPrefs.GetString(uuidKey);
                _uuids.Add(new Guid(currentUuid));
            }

            return _uuids;
        }

        public void Reset()
        {
            PlayerPrefs.SetInt(NumUuidsPlayerPref, 0);
        }

        private void OnDestroy()
        {
            spatialAnchorCore.OnAnchorCreateCompleted.RemoveAllListeners();
        }
    }
}
