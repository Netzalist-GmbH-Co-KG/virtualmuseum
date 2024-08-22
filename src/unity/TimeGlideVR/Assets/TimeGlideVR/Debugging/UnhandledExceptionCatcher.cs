using UnityEngine;
using System;

namespace TimeGlideVR.Debugging
{
    public class UnhandledExceptionCatcher : MonoBehaviour
    {
        private string _exceptionMessage = "";

        void Awake()
        {
            AppDomain.CurrentDomain.UnhandledException += HandleUnhandledException;
            Application.logMessageReceived += HandleLog;
        }

        void OnDestroy()
        {
            AppDomain.CurrentDomain.UnhandledException -= HandleUnhandledException;
            Application.logMessageReceived -= HandleLog;
        }

        void HandleUnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            _exceptionMessage = e.ExceptionObject.ToString();
            Debug.LogError($"Unhandled: {_exceptionMessage}");
        }

        void HandleLog(string logString, string stackTrace, LogType type)
        {
            if (type == LogType.Exception)
            {
                _exceptionMessage += logString + "\n" + stackTrace + "\n";
            }
        }
    }
}