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
        // If there is an instance, and it's not me, delete myself.
        
        if (Instance != null && Instance != this) 
        { 
            Destroy(this); 
        } 
        else 
        { 
            Instance = this;
        } 
    }

    public Texture2D texture;
    public Material skyboxMaterial;

    public Texture2D LoadImage()
    {
        byte[] fileData = File.ReadAllBytes(Application.persistentDataPath + "/image.jpg");
        texture = new Texture2D(Screen.width, Screen.height);
        texture.LoadImage(fileData);

        byte[] bytes = texture.EncodeToJPG();
        File.WriteAllBytes(Application.persistentDataPath + "/image_modified.jpg", bytes);
        Debug.Log("Modified image saved to " + Application.persistentDataPath + "/image_modified.jpg");
        return null;
    }

    // Loads a material data file based on the provided GUID.
    // If the file exists, deserializes the data into a serializable material object,
    // converts it to a Unity material, and returns it.
    public Material LoadMaterial(Guid id)
    {
        string path = Path.Combine(Application.persistentDataPath, $"/media/material{id}.dat");
        if (File.Exists(path))
        {
            byte[] bytes = File.ReadAllBytes(path);
            MPMaterial serializableMaterial = MessagePackSerializer.Deserialize<MPMaterial>(bytes);

            Material material = serializableMaterial.ToMaterial();
            Debug.Log("Material loaded and applied.");
            return material;
        }
        else
        {
            Debug.LogWarning("No saved material found.");
            try {
                DataGetter.Instance.GetSkyBox(id);
            } catch {
                Debug.Log("Couldnt load or find skybox in server");
            }
            
            return null;
        }
    }

    public void LoadSkybox()
    {
        
    }

}