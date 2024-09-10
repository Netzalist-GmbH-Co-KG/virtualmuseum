using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using TimeGlideVR.Server.Data.Inventory;
using TimeGlideVR.Server.Data.Media;
using UnityEngine;
using UnityEngine.Networking;

namespace TimeGlideVR.Server.WebClient
{
    public class ConfigurationClient : IConfigurationClient
    {
        public delegate void ServerRequestCallBack(byte[] response);
        private readonly string _apiUrl;
        private readonly string _apiToken;

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
            using var request = UnityWebRequest.Get(url);
            request.SetRequestHeader("Authorization", $"Bearer {_apiToken}");

            var operation = request.SendWebRequest();
            while (!operation.isDone)
                await Task.Yield();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Error: {request.error}");
                return null;
            }

            var json = request.downloadHandler.text;
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}