using System;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Newtonsoft.Json;
using TimeGlideVR.Server.Data.Inventory;
using TimeGlideVR.Server.Data.Media;
using UnityEngine;
using UnityEngine.Networking;

namespace TimeGlideVR.Server.WebClient
{
    public enum ConnectionState
    {
        Unkown,
        Connected,
        Disconnected
    }
    
    // public class CustomCertHandler : CertificateHandler
    // {
    //     protected override bool ValidateCertificate(byte[] certificateData) {
    //         return true; // Accept all certificates (security risk!)
    //     }
    // }
    
    public class ConfigurationClient : IConfigurationClient
    {
        public delegate void ServerRequestCallBack(byte[] response);
        private readonly string _apiUrl;
        private readonly string _apiToken;
        public ConnectionState ConnectionState { get; private set; } = ConnectionState.Unkown;

        public ConfigurationClient(string apiUrl, string apiToken)
        {
            _apiUrl = apiUrl;
            _apiToken = apiToken;
        }

        public async Task<List<Tenant>> GetTenants()
        {
            return await MakeRequest<List<Tenant>>($"{_apiUrl}tenants");
        }

        public async Task<TopographicalTable> GetTopographicalTableConfiguration(Guid topographicalTableId)
        {
            return await MakeRequest<TopographicalTable>($"{_apiUrl}topographical-table/{topographicalTableId}");
        }

        public async Task<MultimediaPresentation> GetMultiMediaPresentation(Guid multimediaPresentationId)
        {
            return await MakeRequest<MultimediaPresentation>($"{_apiUrl}multimediapresentation/{multimediaPresentationId}");
        }

        private async Task<T> MakeRequest<T>(string url) where T : class
        {
            try
            {
                using var request = UnityWebRequest.Get(url);
//                request.certificateHandler = new CustomCertHandler();
                request.SetRequestHeader("Authorization", $"Bearer {_apiToken}");

                var operation = request.SendWebRequest();
                while (!operation.isDone)
                    await Task.Yield();

                if (request.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogError($"Error: {request.error}");
                    ConnectionState = ConnectionState.Disconnected;
                    return null;
                }

                ConnectionState = ConnectionState.Connected;
                var json = request.downloadHandler.text;
                return JsonConvert.DeserializeObject<T>(json);
            }
            catch (Exception e)
            {
                Debug.LogError(e);
                ConnectionState = ConnectionState.Disconnected;
                return null;
            }
        }
    }
}