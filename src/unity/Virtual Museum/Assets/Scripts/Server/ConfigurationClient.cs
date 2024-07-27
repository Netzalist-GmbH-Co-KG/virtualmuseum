using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Server.Data;
using UnityEngine;
using UnityEngine.Networking;

namespace Server
{
    public class ConfigurationClient
    {
        public delegate void ServerRequestCallBack(byte[] response);
        private readonly string apiUrl;
        private readonly string apiToken;

        public ConfigurationClient(string apiUrl, string apiToken)
        {
            this.apiUrl = apiUrl;
            this.apiToken = apiToken;
        }

        
        public async Task<TopographicalTableConfiguration> GetTableConfiguration(Guid id)
        {
            return await MakeRequest<TopographicalTableConfiguration>($"{apiUrl}topographical-table/{id}");
        }
        
        public async Task<Room> GetRoom(Guid id)
        {
            return await MakeRequest<Room>($"{apiUrl}rooms/{id}");
        }

        public async Task<List<Room>> GetRooms()
        {
            return await MakeRequest<List<Room>>($"{apiUrl}rooms");
        }

        public async Task GetImage(Guid id, ServerRequestCallBack callback = null)
        {
            await RequestBytes($"{apiUrl}media/{id}/display", callback);
        }

        private async Task<T> MakeRequest<T>(string url) where T : class
        {
            using var request = UnityWebRequest.Get(url);
            request.SetRequestHeader("Authorization", $"Bearer {apiToken}");

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
            request.SetRequestHeader("Authorization", $"Bearer {apiToken}");

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