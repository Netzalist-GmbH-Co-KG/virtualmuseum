using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using Server.Data;

public class RoomButton : MonoBehaviour
{
    public Room room;
    public TopographicalTableConfiguration tableConfiguration;
    public TMP_Text text;
    public TMP_Text displayText;
    
    // Start is called before the first frame update
    public void OnClick(){
        RoomConfig.currentRoom = room;
        RoomConfig.currentRoomId = room.Id;
        RoomConfig.mediaId = tableConfiguration.LocationTimeRows[0].GeoEvents[0].MediaFiles[0].Id;

        displayText.text = "Lade Raum " + RoomConfig.currentRoomId + " ...";
        //try to load spatial anchor with current room id
        if(TableSpawn.instance.LoadSpatialAnchor(room.Id)){
            displayText.text = "Tischplatzierung gefunden und geladen!"; 
        } else {
            displayText.text = "Tischplatzierung benötigt";
        }
    }
}
