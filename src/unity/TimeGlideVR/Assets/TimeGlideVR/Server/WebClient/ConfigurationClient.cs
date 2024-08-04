using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using TimeGlideVR.Server.Data;
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

        
        public async Task<TopographicalTableConfiguration> GetTableConfiguration(Guid id)
        {
            return await MakeRequest<TopographicalTableConfiguration>($"{_apiUrl}topographical-table/{id}");
        }
        
        public async Task<Room> GetRoom(Guid id)
        {
            return await MakeRequest<Room>($"{_apiUrl}rooms/{id}");
        }

        public async Task<List<Room>> GetRooms()
        {
            return await MakeRequest<List<Room>>($"{_apiUrl}rooms");
        }

        public async Task GetImage(Guid id, ServerRequestCallBack callback = null)
        {
            await RequestBytes($"{_apiUrl}media/{id}/display", callback);
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

        private async Task RequestBytes(string url, ServerRequestCallBack callback = null)
        {
            using var request = UnityWebRequest.Get(url);
            request.SetRequestHeader("Authorization", $"Bearer {_apiToken}");

            var operation = request.SendWebRequest();
            while (!operation.isDone)
                await Task.Yield();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("Failed to get image in path: '" + url + "' Are you sure it exists?");
                Debug.LogError($"Error: {request.error}");
                return;
            }
            callback?.Invoke(request.downloadHandler.data);
        }
    }
}