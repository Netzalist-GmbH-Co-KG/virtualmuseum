using TimeGlideVR.Server.Cache;
using TimeGlideVR.Server.WebClient;
using UnityEngine;

namespace TimeGlideVR.Server
{
    public class ConfigurationManager : MonoBehaviour
    {
        [SerializeField] private string apiUrl = "http://timeglide.xr-ai.de:5001/api/";
        [SerializeField] private string apiToken = "your-api-token";

        private string _persistentDirectory;
        
        private void Awake()
        {
            ConfigurationClient = new DataCache(new ConfigurationClient(apiUrl, apiToken));
        }

        public IConfigurationClient ConfigurationClient { get; private set; }
    }
}