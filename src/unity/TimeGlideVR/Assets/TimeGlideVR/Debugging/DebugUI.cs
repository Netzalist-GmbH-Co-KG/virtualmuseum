using System;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

namespace TimeGlideVR.Debugging
{
    public class DebugUI : MonoBehaviour
    {
        private readonly List<string> _debugMessages = new();
        private TextMeshPro _debugText;
        private static DebugUI _instance;
    

        void Start()
        {
            _debugText = GetComponentInChildren<TextMeshPro>();
        }
    
        private static DebugUI Instance
        {
            get
            {
                try
                {
                    if(_instance == null)
                        _instance = FindObjectOfType<DebugUI>();
                    return _instance;
                }
                catch (Exception e)
                {
                    Debug.Log(e);
                    return null;
                }
            }
        }
    
        private void LogMessage(string message)
        {
            if (_debugMessages.Count > 30)
            {
                _debugMessages.RemoveAt(_debugMessages.Count - 1);
            }
            _debugMessages.Insert(0, message);
            _debugText.text = string.Join("\n", _debugMessages);
        }
    
        public static void Log(string message)
        {
            Debug.Log(message);
            Instance.LogMessage(message);
        }
    }
}
