using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DemoStartScript : MonoBehaviour
{
    public static bool demo = false;
    public GameObject ClusterUI;
    public GameObject DemoUI;
    // Start is called before the first frame update
    private void Start() {
        demo = false;
        string preferedRoom = PlayerPrefs.GetString("PreferedRoom");
        if(string.IsNullOrEmpty(preferedRoom)) return;
        if(preferedRoom == "Demo"){
            RoomConfig.mediaId = Guid.Parse("00000000-0000-0000-0000-000000000000");
            demo = true;
            ClusterUI.SetActive(false);
            //DemoUI.SetActive(true);
            TableSpawn.instance.TestPlacetable();
        }
        GetComponent<PopupNotificationHandler>().Popup("Willkommen in der Demo!");
    }

    /*
    void Update(){
        if(Input.GetKeyDown(KeyCode.Space)){
            PlayerPrefs.SetString("PreferedRoom", "Demo");
            ClusterUI.SetActive(false);
            DemoUI.SetActive(true);
            TableSpawn.instance.TestPlacetable();
        }
    }
    */
}
