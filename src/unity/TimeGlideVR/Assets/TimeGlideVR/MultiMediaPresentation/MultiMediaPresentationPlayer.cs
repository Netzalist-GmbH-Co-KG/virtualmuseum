using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TimeGlideVR.Server.Data.Media;
using TimeGlideVR.TableInstallation.ItemDropper;
using UnityEngine;

namespace TimeGlideVR.MultiMediaPresentation
{
    public class MultiMediaPresentationPlayer : MonoBehaviour
    {
        [SerializeField] private List<GameObject> objectsToHide = new ();
        [SerializeField] private MapIndicator mapIndicator;
        private void HideHiddenObjects()
        {
            try
            {
                Debug.Log("Hiding other objects");
                if (objectsToHide == null) return;
                foreach (var objectToHide in objectsToHide)
                {
                    if (objectsToHide != null)
                        objectToHide.SetActive(false);
                }

                if (mapIndicator != null)
                    mapIndicator.HideSpawnedItems();
            }
            catch (Exception e)
            {
                Debug.LogError(e);
            }
        }
        private void ShowHiddenObjects()
        {
            try
            {
                Debug.Log("Showing other objects");
                if (objectsToHide == null) return;
                foreach (var objectToHide in objectsToHide)
                {
                    if (objectsToHide != null)
                        objectToHide.SetActive(true);
                }

                if (mapIndicator != null)
                    mapIndicator.ShowSpawnedItems();
            }
            catch (Exception e)
            {
                Debug.LogError(e);
            }
        }   
        private class PresentationItemStart
        {
            public PresentationItem PresentationItem { get; set; }
            public float Start { get; set; }
        }
        
        private MediaTypeUnityEvents _mediaTypeUnityEvents;
        private Dictionary<int, List<PresentationItemStart>> _slots;
        private Dictionary<int, PresentationItem> _currentlyDisplayedItems = new ();
        private float _presentationDuration;
        
        private void Start()
        {
            _mediaTypeUnityEvents = FindObjectOfType<MediaTypeUnityEvents>(true);
            _mediaTypeUnityEvents.ResetMediaEvent.AddListener(() =>
            {
                Debug.Log("Stopping presentation");
                _currentlyDisplayedItems?.Clear();
                _slots?.Clear();
                _presentationDuration = 0;
                ShowHiddenObjects();
            });
        }

        private float _startTime;
        
        public void StartPresentation()
        {
            Debug.Log($"Starting presentation");
            StartCoroutine(RunPresentation());
        }
        
        // Coroutine to display media at the correct timestamp
        private IEnumerator RunPresentation()
        {
            _startTime = Time.time;
            HideHiddenObjects();
            while (true)
            {
                DisplayAllMediaAtTimestamp(Time.time - _startTime);
                if (!(Time.time - _startTime > _presentationDuration))
                    yield return new WaitForSeconds(1);
                else
                    break;
            }
            ShowHiddenObjects();
            Debug.Log("Presentation finished");
        }

        private void DisplayAllMediaAtTimestamp(float secondsSinceStart)
        {
            // Create Dictionary with the current item per slot
            var currentItems = _slots
                .ToDictionary( 
                    x=> x.Key, 
                    x=> x.Value.LastOrDefault( item=> item.Start <= secondsSinceStart && item.Start + item.PresentationItem.DurationInSeconds > secondsSinceStart));
            
            
            // Check if the current item is different from the last displayed item
            foreach (var slot in currentItems)
            {
                PresentationItem currentItem;
                
                if (slot.Value == null)
                {
                    if(_currentlyDisplayedItems.TryGetValue(slot.Key, out currentItem))
                    {
                        if(currentItem == null) continue;
                        Debug.Log($"Clearing media for slot {slot.Key} at {secondsSinceStart}");
                        _currentlyDisplayedItems[slot.Key] = null;
                        _mediaTypeUnityEvents.InvokeDisplayMedia(slot.Key, null);
                    }
                    continue;
                }
                
                if (_currentlyDisplayedItems.TryGetValue(slot.Key, out currentItem))
                {
                    if (currentItem.Id == slot.Value.PresentationItem.Id) continue;
                    
                    //Debug.Log($"Displaying media for slot {slot.Key}: {slot.Value.PresentationItem!.MediaFile!.Name} at {secondsSinceStart}");
                    _mediaTypeUnityEvents.InvokeDisplayMedia(slot.Key, slot.Value.PresentationItem);
                    _currentlyDisplayedItems[slot.Key] = slot.Value.PresentationItem;
                }
                else
                {
                    //Debug.Log($"Displaying media for slot {slot.Key}: {slot.Value.PresentationItem!.MediaFile!.Name} at {secondsSinceStart}");
                    _mediaTypeUnityEvents.InvokeDisplayMedia(slot.Key, slot.Value.PresentationItem);
                    _currentlyDisplayedItems[slot.Key] = slot.Value.PresentationItem;
                }
            }
        }
        
        public void Init(MultimediaPresentation presentation)
        {
            _slots = presentation.PresentationItems
                .GroupBy( p=> p.SlotNumber)
                .Select( g => new { Slot = g.Key, 
                    Items = g.OrderBy( item=>item.SequenceNumber)
                        .Select( pi=> new PresentationItemStart
                        {
                            PresentationItem = pi,
                            Start = 0
                        })
                        .ToList()})
                .ToDictionary( x=> x.Slot, x=> x.Items);

            
            foreach (var slot in _slots)
            {
                var start = 0;
                foreach (var presentationItem in slot.Value)
                {
                    presentationItem.Start = start;
                    start += presentationItem.PresentationItem.DurationInSeconds;
                }
            }
            
            _presentationDuration = 
                _slots
                    .Max( s=> s.Value.Last().Start + s.Value.Last().PresentationItem.DurationInSeconds);
        }
    }
}
