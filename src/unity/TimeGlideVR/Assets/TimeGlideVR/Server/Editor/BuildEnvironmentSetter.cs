#if UNITY_EDITOR
using System.IO;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace TimeGlideVR.Server.Editor
{
    /// <summary>
    /// Custom build processor that injects environment settings during build time
    /// by modifying the CurrentEnvironmentName in EnvironmentSettings.cs
    /// </summary>
    public class BuildEnvironmentSetter : IPreprocessBuildWithReport
    {
        public int callbackOrder => 0;

        public void OnPreprocessBuild(BuildReport report)
        {
            // Get the environment from command line arguments
            var environmentName = GetCommandLineArg("-environment");
            
            if (!string.IsNullOrEmpty(environmentName))
            {
                SetEnvironmentForBuild(environmentName);
            }
        }

        private string GetCommandLineArg(string name)
        {
            var args = System.Environment.GetCommandLineArgs();
            for (var i = 0; i < args.Length; i++)
            {
                if (args[i] == name && i + 1 < args.Length)
                {
                    return args[i + 1];
                }
            }
            return null;
        }

        public void SetEnvironmentForBuild(string environmentName)
        {
            Debug.Log($"Setting build environment to: {environmentName}");
            
            // Path to the EnvironmentSettings.cs file
            var filePath = "Assets/TimeGlideVR/Server/EnvironmentSettings.cs";
            
            if (!File.Exists(filePath))
            {
                Debug.LogError($"EnvironmentSettings.cs not found at {filePath}");
                return;
            }
            
            // Read the file content
            var content = File.ReadAllText(filePath);
            
            // Use regex to replace the CurrentEnvironmentName value
            var pattern = "(public const string CurrentEnvironmentName = \")[^\"]*(\";)";
            var replacement = $"$1{environmentName}$2";
            
            // Replace the environment name
            var modifiedContent = Regex.Replace(content, pattern, replacement);
            
            // Write the modified content back to the file
            File.WriteAllText(filePath, modifiedContent);
            
            // Refresh the AssetDatabase to ensure Unity recompiles with the new setting
            AssetDatabase.Refresh();
            
            Debug.Log($"Updated EnvironmentSettings.cs with environment: {environmentName}");
        }
    }
}
#endif
