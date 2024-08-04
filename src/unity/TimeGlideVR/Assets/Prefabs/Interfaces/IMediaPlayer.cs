using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public interface IMediaPlayer
{

    public Guid mediaId { get; set; }
    public void GetMediaById();
}
