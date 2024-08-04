using UnityEngine;

namespace TimeGlideVR.Debugging
{
    public class ConsoleToGUI : MonoBehaviour
    {
        void OnEnable()
        {
            Application.logMessageReceived += HandleLog;
        }

        void OnDisable()
        {
            Application.logMessageReceived -= HandleLog;
        }

        void HandleLog(string logString, string stackTrace, LogType type)
        {
            DebugUI.Log(logString);
        }
    }
}