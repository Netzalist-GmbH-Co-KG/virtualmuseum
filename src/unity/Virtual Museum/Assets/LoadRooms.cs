using TMPro;
using UnityEngine;
using Server;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;

[RequireComponent(typeof(ConfigurationManager))]
public class LoadRooms : MonoBehaviour
{
    public TMP_Text text;
    public GameObject buttonPrefab;
    public ConfigurationManager configurationManager;
    // Start is called before the first frame update
    async void Start()
    {
        await GetCurrentRooms();
    }

    
    public async Task GetCurrentRooms(){
        RoomConfig.isTableConfigured = false;
        configurationManager = GetComponent<ConfigurationManager>();
        
        //Test script. Actual way of doing it would be using buttons at the start up in the admin view!
        //-> Check wether the controllers are detected and if they are: 1. get all configured rooms from the server 2. display buttons with room names and ids
        text.text = "Lade Räume...";
        var rooms = await configurationManager.ConfigurationClient.GetRooms();
        Debug.Log(JsonConvert.SerializeObject(rooms, Formatting.Indented));
        if(rooms.Count==0){
            text.text = "Keine Räume gefunden, bist du sicher, dass du Räume angelegt hast?";
            return;
        }

        foreach(var room in rooms){
            var room2 = await configurationManager.ConfigurationClient.GetRoom(room.Id);
            Debug.Log($"First Room: {room2.Label} ");
            var tablePlacement = room2.InventoryPlacements.FirstOrDefault( p=>p.InventoryItem?.TypeOfItem=="TOPOGRAPHICAL_TABLE");
            if(tablePlacement==null)
                continue;
            var tableConfiguration = await configurationManager.ConfigurationClient.GetTableConfiguration(tablePlacement.InventoryItem!.Id);
            var button = Instantiate(buttonPrefab, transform);
            button.GetComponent<RoomButton>().room = room;
            button.GetComponent<RoomButton>().text.text = room.Label;
            button.GetComponent<RoomButton>().tableConfiguration = tableConfiguration;
            button.GetComponent<RoomButton>().displayText = text;
        }
        text.text = "Räume:";
        
    }
}
