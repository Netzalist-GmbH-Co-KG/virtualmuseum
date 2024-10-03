using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace virtualmuseum.web.data.Model.Media;

/// <summary>
/// A MediaFile represents a file that can be displayed in virtual reality
/// Possible types are
/// 2DImage, 3DImage, 360DegreeImage, 2DVideo, 3DVideo, 360DegreeVideo
/// MP3, Narration, Text, PDF
/// The binary data can be downloaded from the Url
/// </summary>
public class MediaFile
{
    [Key]
    [Column(TypeName = "TEXT")]
    public string Id { get; set; } = null!;
    public string? FileName { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public float DurationInSeconds { get; set; }
    public MediaType Type { get; set; }
    public string? Url { get; set; }
}