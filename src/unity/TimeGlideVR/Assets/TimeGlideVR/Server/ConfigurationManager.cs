using TimeGlideVR.Server.Cache;
using TimeGlideVR.Server.WebClient;
using UnityEngine;
using System.IO;
using System.Collections.Generic;

namespace TimeGlideVR.Server
{
    public class ConfigurationManager : MonoBehaviour
    {
        // Default values if environment is not found
        private string defaultApiUrl = "http://timeglide.xr-ai.de:5001/api/";
        private string defaultApiToken = "your-api-token";
        
        // The current environment name is set in EnvironmentSettings.cs
        private string currentEnvironmentName;

        public ConnectionState ConnectionState => ConfigurationClient?.ConnectionState ?? ConnectionState.Unkown;
        
        private void Awake()
        {
            // Get the environment name from the static settings
            currentEnvironmentName = EnvironmentSettings.CurrentEnvironmentName;
            
            // Try to load environment from config file (useful for runtime switching/testing)
            LoadEnvironmentFromConfigFile();
            
            // Get the appropriate URL and token for the current environment
            var apiUrl = GetApiUrlForEnvironment(currentEnvironmentName);
            var apiToken = GetApiTokenForEnvironment(currentEnvironmentName);
            
            Debug.Log($"Initializing with environment: {currentEnvironmentName}, URL: {apiUrl}");
            ConfigurationClient = new ConfigurationClient(apiUrl, apiToken);
        }

        /// <summary>
        /// Gets the API URL for the specified environment name
        /// </summary>
        private string GetApiUrlForEnvironment(string environmentName)
        {
            // Look up the environment in our static dictionary
            if (EnvironmentSettings.Environments.TryGetValue(environmentName, out var config))
            {
                return config.ApiUrl;
            }
            
            Debug.LogWarning($"Environment '{environmentName}' not found, using default URL");
            return defaultApiUrl;
        }

        /// <summary>
        /// Gets the API token for the specified environment name
        /// </summary>
        private string GetApiTokenForEnvironment(string environmentName)
        {
            // Look up the environment in our static dictionary
            if (EnvironmentSettings.Environments.TryGetValue(environmentName, out var config))
            {
                return config.ApiToken;
            }
            
            Debug.LogWarning($"Environment '{environmentName}' not found, using default token");
            return defaultApiToken;
        }

        /// <summary>
        /// Attempts to load environment setting from a config file
        /// This is useful for testing different environments without rebuilding
        /// </summary>
        private void LoadEnvironmentFromConfigFile()
        {
            try
            {
                var configPath = Path.Combine(Application.persistentDataPath, "environment.txt");
                if (File.Exists(configPath))
                {
                    var envName = File.ReadAllText(configPath).Trim();
                    if (!string.IsNullOrEmpty(envName))
                    {
                        currentEnvironmentName = envName;
                        Debug.Log($"Loaded environment from config file: {currentEnvironmentName}");
                    }
                }
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"Error loading environment config: {ex.Message}");
            }
        }

        public IConfigurationClient ConfigurationClient { get; private set; }
    }
}