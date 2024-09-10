using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using virtualmuseum.web.api.Services;
using virtualmuseum.web.api.Services.ConfigurationRepository;
using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Api;

[ApiController]
[Route("api")]
public class ConfigurationController : Controller, IConfigurationRepository
{
    private readonly IConfigurationRepository _configurationRepository;
    private readonly ILogger<ConfigurationController> _logger;

    public ConfigurationController(IConfigurationRepository configurationRepository, ILogger<ConfigurationController> logger)
    {
        _configurationRepository = configurationRepository;
        _logger = logger;
    }


    [HttpGet("tenants")]
    public List<Tenant> GetTenants()
    {
        try
        {
            return _configurationRepository.GetTenants();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error while getting list of tenants");
            return [];
        }
    }

    [HttpGet("topographical-table/{id}")]
    public TopographicalTable GetTopographicalTableConfiguration(Guid id)
    {
        try
        {
            return _configurationRepository.GetTopographicalTableConfiguration(id);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error while getting topographical table configuration for table {id}", id);
            return new TopographicalTable();
        }
    }

    [HttpGet("multimediapresentation/{multimediaPresentationId}")]
    public MultimediaPresentation GetMultiMediaPresentation(Guid multimediaPresentationId)
    {
        try
        {
            return _configurationRepository.GetMultiMediaPresentation(multimediaPresentationId);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error while getting multimedia presentation {multimediaPresentationId}", multimediaPresentationId);
            return new MultimediaPresentation();
        }
    }
}
