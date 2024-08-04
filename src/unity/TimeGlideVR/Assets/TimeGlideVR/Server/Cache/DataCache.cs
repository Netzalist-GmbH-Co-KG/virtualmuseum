using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using JetBrains.Annotations;
using TimeGlideVR.Server.Data;
using TimeGlideVR.Server.WebClient;
using UnityEngine;

namespace TimeGlideVR.Server.Cache
{
    public class DataCache : IConfigurationClient
    {
        private readonly string _persistentDirectory;
        private readonly ConfigurationClient _webClient;
        private readonly Dictionary<string, CacheItem> _cache = new();

        private int _circuitBreaker = 0;
        private DateTime _circuitBreakerReset = DateTime.Now;

        public DataCache(ConfigurationClient webClient)
        {
            _persistentDirectory = Application.persistentDataPath;
            _webClient = webClient;
        }

        public async Task<TopographicalTableConfiguration> GetTableConfiguration(Guid id)
        {
            return await GetCachedItem("table_" + id, async () => await _webClient.GetTableConfiguration(id));
        }

        public async Task<Room> GetRoom(Guid id)
        {
            return await GetCachedItem("room_" + id, async () => await _webClient.GetRoom(id));
        }

        public async Task<List<Room>> GetRooms()
        {
            return await GetCachedItem("rooms", async () => await _webClient.GetRooms());
        }

        public async Task GetImage(Guid id, ConfigurationClient.ServerRequestCallBack callback = null)
        {
            var image = await GetImageFromCache(id)!;
            if (image != null)
            {
                callback?.Invoke(image);
                return;
            }

            await _webClient.GetImage(id, callback);
        }

        [CanBeNull]
        private async Task<byte[]> GetImageFromCache(Guid id)
        {
            try
            {
                // Try to load from Disk
                var filePath = Path.Combine(_persistentDirectory, "image_" + id);
                if (!File.Exists(filePath)) return null;
                Debug.Log($"Loaded image from disk: image-{id}");
                return await File.ReadAllBytesAsync(filePath);
            }
            catch (Exception e)
            {
                Debug.Log($"Failed to load image from disk: image-{id}: {e}");
                Debug.LogError(e);
                return null;
            }
        }

        private async Task<T> GetCachedItem<T>(string cacheId, Func<Task<T>> retrieval) where T : class
        {
            try
            {
                // First try to get item from memory
                if (_cache.TryGetValue(cacheId, out var cacheItem))
                {
                    if (cacheItem.Expiration > DateTime.Now)
                    {
                        Debug.Log($"Loaded {typeof(T)} from memory: {cacheId}");
                        return JsonUtility.FromJson<T>(cacheItem.JsonData);
                    }

                    Debug.Log($"Cache for {typeof(T)} expired: {cacheId}");
                    _cache.Remove(cacheId);
                }

                // Second try to load from disk
                var cachedItem = await TryReadCachedItemFromFile<T>(cacheId);
                if (cachedItem != null)
                {
                    Debug.Log($"Loaded {typeof(T)} from disk: {cacheId}");
                    return cachedItem;
                }

                // last try to load from web
                cachedItem = await TryReadCachedItemFromWeb(cacheId, retrieval);
                if(cachedItem != null)
                    Debug.Log($"Loaded {typeof(T)} from web: {cacheId}");
                else
                    Debug.Log($"Failed to load {typeof(T)} from web: {cacheId}");
                return cachedItem;
            }
            catch (Exception e)
            {
                Debug.Log($"Failed to load {typeof(T)}: {cacheId}: {e}");
                Debug.LogError(e);
                return null;
            }
        }

        private async Task<T> TryReadCachedItemFromFile<T>(string cacheId) where T : class
        {
            try
            {
                var filePath = Path.Combine(_persistentDirectory, cacheId);
                if (!File.Exists(filePath)) return null;

                var rawData = await File.ReadAllTextAsync(filePath);
                var cacheItem = JsonUtility.FromJson<CacheItem>(rawData);
                if (cacheItem.Expiration > DateTime.Now)
                {
                    _cache[cacheId] = cacheItem;
                    return JsonUtility.FromJson<T>(cacheItem.JsonData);
                }

                File.Delete(filePath);
                return null;
            }
            catch (Exception e)
            {
                Debug.LogError(e);
                return null;
            }
        }

        private async Task<T> TryReadCachedItemFromWeb<T>(string cacheId, Func<Task<T>> retrieval) where T : class
        {
            try
            {
                if (_circuitBreaker > 0)
                {
                    if (_circuitBreakerReset > DateTime.Now)
                    {
                        Debug.LogError("Circuit breaker tripped");
                        return null;
                    }

                    _circuitBreaker = 0;
                }

                var data = await retrieval();
                _cache[cacheId] = new CacheItem
                {
                    CacheId = cacheId,
                    Expiration = DateTime.Now.AddMinutes(5),
                    JsonData = JsonUtility.ToJson(data)
                };
                await WriteCachedItemToFile(cacheId, data);
                return data;
            }
            catch (Exception e)
            {
                Debug.LogError(e);
                _circuitBreaker++;
                if (_circuitBreaker > 5)
                    _circuitBreaker = 5;

                _circuitBreakerReset = DateTime.Now.AddMinutes(2 ^ _circuitBreaker);
                return null;
            }
        }

        private async Task WriteCachedItemToFile<T>(string cacheId, T data) where T : class
        {
            try
            {
                var filePath = Path.Combine(_persistentDirectory, cacheId);
                var cacheItem = new CacheItem
                {
                    CacheId = cacheId,
                    Expiration = DateTime.Now.AddMinutes(5),
                    JsonData = JsonUtility.ToJson(data)
                };
                await File.WriteAllTextAsync(filePath, JsonUtility.ToJson(cacheItem));
            }
            catch (Exception e)
            {
                Debug.LogError(e);
            }
        }
    }
}