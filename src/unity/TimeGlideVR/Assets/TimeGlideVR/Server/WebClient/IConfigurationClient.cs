using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TimeGlideVR.Server.Data;
using TimeGlideVR.Server.Data.Inventory;
using TimeGlideVR.Server.Data.Media;

namespace TimeGlideVR.Server.WebClient
{
    public interface IConfigurationClient
    {
        Task<List<Tenant>> GetTenants();
        Task<TopographicalTable> GetTopographicalTableConfiguration(Guid topographicalTableId);
        Task<MultimediaPresentation> GetMultiMediaPresentation(Guid multimediaPresentationId);
        ConnectionState ConnectionState { get; }
    }
}