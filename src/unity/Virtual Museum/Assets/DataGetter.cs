using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Server;
using UnityEngine;
using static Server.ConfigurationClient;

[RequireComponent(typeof(ConfigurationManager))]
public class DataGetter : MonoBehaviour
{
    public static DataGetter Instance { get; private set; }

    private void Awake() 
    { 
        // If there is an instance, and it's not me, delete myself.
        
        if (Instance != null && Instance != this) 
        { 
            Destroy(this); 
        } 
        else 
        { 
            Instance = this; 
            configurationManager = GetComponent<ConfigurationManager>();
        } 
    }

    private Guid currentID;
    private ConfigurationManager configurationManager;
    private bool getterRunning = false;

    List<Guid> imagesToLoad = new List<Guid>();
    List<ServerRequestCallBack> callBacks = new List<ServerRequestCallBack>();

    public async Task GetImage(Guid id){
        Debug.Log("Getting image " + id);
        //Check if we already have this image
        if(File.Exists(DataSaver.ImagePath + $"image{id}.png")){
            Debug.Log("Image already exists on disk, skipping");
            return;
        }
        if(getterRunning){
            imagesToLoad.Add(id);
            return;
        }
        getterRunning = true;
        currentID = id;
        await configurationManager.ConfigurationClient.GetImage(id, ImageCallback);
    }

    public async void ImageCallback(byte[] data){
        var texture = new Texture2D(2, 2);
        texture.LoadImage(data);

        try {
            DataSaver.Instance.SaveAsPNG(texture, currentID);
        } catch {
            Debug.Log("Failed to save image");
        }
        getterRunning = false;

        if(imagesToLoad.Count > 0){
            await GetImage(imagesToLoad[0]);
            imagesToLoad.RemoveAt(0);
            callBacks.RemoveAt(0);
        }
    }
}