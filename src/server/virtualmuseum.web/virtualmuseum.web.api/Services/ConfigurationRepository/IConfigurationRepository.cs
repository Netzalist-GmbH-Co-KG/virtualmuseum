using virtualmuseum.web.data;
using virtualmuseum.web.data.Model.Inventory;
using virtualmuseum.web.data.Model.Media;

namespace virtualmuseum.web.api.Services.ConfigurationRepository;

public interface IConfigurationRepository
{
    List<Tenant> GetTenants();
    List<MediaFile> GetMediaFiles();
    List<MultimediaPresentation> GetMultiMediaPresentation();
    TopographicalTable GetTopographicalTableConfiguration(Guid topographicalTableId);
    MultimediaPresentation GetMultiMediaPresentation(Guid multimediaPresentationId);
    void SaveMediaFile(MediaFile? mediaFile);
    void SavePresentation(MultimediaPresentation? multimediaPresentation);

}