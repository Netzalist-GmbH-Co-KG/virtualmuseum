﻿using System.ComponentModel.DataAnnotations.Schema;

namespace virtualmuseum.web.data;

/// <summary>
/// The configuration of a virtual topographical table
/// The table has a label and a list of TimeSeries
/// which can be selected by the user.
/// </summary>
public class TopographicalTable
{
    public Guid Id { get; set; }
    [NotMapped]
    public List<TimeSeries> TimeSeries { get; set; } = [];
}