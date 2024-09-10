using virtualmuseum.web.data;

namespace virtualmuseum.web.api.Services.ConfigurationRepository;

public interface IConfigurationRepository
{
    List<Tenant> GetTenants();
    TopographicalTable GetTopographicalTableConfiguration(Guid topographicalTableId);
    MultimediaPresentation GetMultiMediaPresentation(Guid multimediaPresentationId);
}