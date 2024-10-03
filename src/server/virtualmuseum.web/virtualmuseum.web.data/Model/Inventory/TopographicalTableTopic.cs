using System.ComponentModel.DataAnnotations.Schema;

namespace virtualmuseum.web.data.Model.Inventory;

/// <summary>
/// A topographical table topic
/// A topic combines a selection of time series and servers
/// as a kind of main menu for the user.
/// There can be multiple topics for a single table.
/// </summary>
public class TopographicalTableTopic
{
    public Guid Id { get; set; }
    // The id of the topographical table this topic belongs to
    public Guid TopographicalTableId { get; set; }
    // A heading for the topic
    public string Topic { get; set; } = null!;
    // A longer description of the topic
    public string Description { get; set; } = null!;
    // An optional image that can be displayed for the topic in the menu
    public Guid? MediaFileImage2DId { get; set; }

    [NotMapped]
    public List<TimeSeries.TimeSeries> TimeSeries { get; set; } = [];
}