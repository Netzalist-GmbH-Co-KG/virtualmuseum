using System;
using System.IO;
using MessagePack;
using Server;

using UnityEngine;

[RequireComponent(typeof(ConfigurationManager))]
public class DataLoader : MonoBehaviour
{
    public static DataLoader Instance { get; private set; }

    private void Awake() 
    { 
        if (Instance != null && Instance != this) 
        { 
            Destroy(this); 
        } 
        else 
        { 
            Instance = this;
        } 
    }

    public Material skyboxMaterial;

    public Texture2D LoadImage(string path, Texture2D texture)
    {
        byte[] fileData = File.ReadAllBytes(path);
        texture = new Texture2D(2, 2);
        texture.LoadImage(fileData);
        return texture;
    }
}
