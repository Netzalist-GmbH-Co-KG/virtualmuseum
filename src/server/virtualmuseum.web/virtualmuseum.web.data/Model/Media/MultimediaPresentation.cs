using System.ComponentModel.DataAnnotations.Schema;

namespace virtualmuseum.web.data;

public class MultimediaPresentation
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }

    // ---------
    [NotMapped]
    public List<PresentationItem> PresentationItems { get; set; } = [];
}