using System;

namespace TimeGlideVR.Debugging
{
    public class TimeLogger : IDisposable
    {
        private DateTime _startTime;
        private string _message;
        
        public TimeLogger(string message)
        {
            _message = message;
            _startTime = DateTime.Now;
            UnityEngine.Debug.Log($"Started: {message}");
        }

        public void Dispose()
        {
            UnityEngine.Debug.Log($"Finished: {_message}");
            UnityEngine.Debug.Log($"Elapsed: {(DateTime.Now - _startTime).TotalMilliseconds:0}ms");
        }
    }
}