using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TimeGlideVR.Server.Data.Media;
using UnityEngine;

namespace TimeGlideVR.MultiMediaPresentation
{
    public class MultiMediaPresentationPlayer : MonoBehaviour
    {
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
        }

        private float _startTime;
        
        public void StartPresentation()
        {
            StartCoroutine(RunPresentation());
        }
        
        // Coroutine to display media at the correct timestamp
        private IEnumerator RunPresentation()
        {
            _startTime = Time.time;
            while (true)
            {
                DisplayAllMediaAtTimestamp(Time.time - _startTime);
                if (!(Time.time - _startTime > _presentationDuration))
                    yield return new WaitForSeconds(5);
                else
                    break;
            }
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
                        // _mediaTypeUnityEvents.InvokeDisplayMedia(null);
                    }
                    continue;
                }
                
                if (_currentlyDisplayedItems.TryGetValue(slot.Key, out currentItem))
                {
                    if (currentItem.Id == slot.Value.PresentationItem.Id) continue;
                    
                    Debug.Log($"Displaying media for slot {slot.Key}: {slot.Value.PresentationItem!.MediaFile!.Name} at {secondsSinceStart}");
                    // _mediaTypeUnityEvents.InvokeDisplayMedia(slot.Value.PresentationItem);
                    _currentlyDisplayedItems[slot.Key] = slot.Value.PresentationItem;
                }
                else
                {
                    Debug.Log($"Displaying media for slot {slot.Key}: {slot.Value.PresentationItem!.MediaFile!.Name} at {secondsSinceStart}");
                    //_mediaTypeUnityEvents.InvokeDisplayMedia(slot.Value.PresentationItem);
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
