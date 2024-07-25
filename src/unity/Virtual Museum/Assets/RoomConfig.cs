using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Server;
using Server.Data;
using TMPro;
using UnityEngine;

[RequireComponent(typeof(ConfigurationManager))]
public class RoomConfig : MonoBehaviour
{
    static public Guid currentRoomId = Guid.Empty;
    static public Guid mediaId = Guid.Empty;
    static bool isTableConfigured = false;
    ConfigurationManager configurationManager;

    public async Task GetCurrentRoom(){
        isTableConfigured = false;
        configurationManager = GetComponent<ConfigurationManager>();
        
        //Test script. Actual way of doing it would be using buttons at the start up in the admin view!
        //-> Check wether the controllers are detected and if they are: 1. get all configured rooms from the server 2. display buttons with room names and ids

        var rooms = await configurationManager.ConfigurationClient.GetRooms();
        Debug.Log("Rooms:");
        Debug.Log(JsonConvert.SerializeObject(rooms, Formatting.Indented));
        if(rooms.Count==0)
            return;
        var firstRoom = await configurationManager.ConfigurationClient.GetRoom(rooms[0].Id);
        Debug.Log($"First Room: {firstRoom.Label} ");
        
        var tablePlacement = firstRoom.InventoryPlacements.FirstOrDefault( p=>p.InventoryItem?.TypeOfItem=="TOPOGRAPHICAL_TABLE");
        if(tablePlacement==null)
            return;
        var tableConfiguration = await configurationManager.ConfigurationClient.GetTableConfiguration(tablePlacement.InventoryItem!.Id);

        mediaId = tableConfiguration.LocationTimeRows[0].GeoEvents[0].MediaFiles[0].Id;
        currentRoomId = firstRoom.Id;
        isTableConfigured = true;
    }
}
