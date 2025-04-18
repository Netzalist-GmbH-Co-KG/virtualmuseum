using System.Collections.Generic;

namespace TimeGlideVR.Server
{
    /// <summary>
    /// Static class that holds environment configuration settings.
    /// Edit this file to add new customer environments.
    /// The build pipeline will modify only the CurrentEnvironmentName constant.
    /// </summary>
    public static class EnvironmentSettings
    {
        // This is the only value that will be modified by the build pipeline
        public const string CurrentEnvironmentName = "TWLocal";
        
        // Add all your customer environments here
        public static readonly Dictionary<string, CustomerEnvironmentConfig> Environments = new Dictionary<string, CustomerEnvironmentConfig>
        {
            // Default environment
            { 
                "Default", new CustomerEnvironmentConfig 
                { 
                    ApiUrl = "http://timeglide.xr-ai.de:5001/api/",
                    ApiToken = "your-api-token" 
                }
            },
            
            // Customer environments - add more as needed
            { 
                "TWLocal", new CustomerEnvironmentConfig 
                { 
                    ApiUrl = "https://timeglidevr.xr-ai.de/api/",
                    ApiToken = "tw-token" 
                }
            },
            
            { 
                "Wilhelmsburg", new CustomerEnvironmentConfig 
                { 
                    ApiUrl = "http://192.168.178.63:3000/api/",
                    ApiToken = "wilhelmsburg-token" 
                }
            },
        };
    }

    /// <summary>
    /// Configuration for a customer environment
    /// </summary>
    public class CustomerEnvironmentConfig
    {
        public string ApiUrl { get; set; }
        public string ApiToken { get; set; }
    }
}
