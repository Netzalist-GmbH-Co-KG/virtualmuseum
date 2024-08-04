using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TimeGlideVR.Server.Data;

namespace TimeGlideVR.Server.WebClient
{
    public interface IConfigurationClient
    {
        Task<TopographicalTableConfiguration> GetTableConfiguration(Guid id);
        Task<Room> GetRoom(Guid id);
        Task<List<Room>> GetRooms();
        Task GetImage(Guid id, ConfigurationClient.ServerRequestCallBack callback = null);
    }
}