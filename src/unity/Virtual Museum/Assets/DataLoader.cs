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

    public Texture2D texture;
    public Material skyboxMaterial;

    public Texture2D LoadImage()
    {
        byte[] fileData = File.ReadAllBytes(Application.persistentDataPath + "/image.jpg");
        texture = new Texture2D(2, 2);
        texture.LoadImage(fileData);

        byte[] bytes = texture.EncodeToJPG();
        File.WriteAllBytes(Application.persistentDataPath + "/image_modified.jpg", bytes);
        Debug.Log("Modified image saved to " + Application.persistentDataPath + "/image_modified.jpg");
        return texture;
    }

    public Material LoadMaterial(Guid id)
    {
        string path = Path.Combine(Application.persistentDataPath, $"material{id}.dat");
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
                Debug.Log("Could not load or find skybox in server");
            }
            return null;
        }
    }

    public Material LoadSkybox(Guid id)
    {
        string path = Path.Combine(Application.persistentDataPath, $"material{id}.dat");
        if (File.Exists(path))
        {
            byte[] bytes = File.ReadAllBytes(path);
            MPMaterial serializableMaterial = MessagePackSerializer.Deserialize<MPMaterial>(bytes);

            Material material = serializableMaterial.ToMaterial();
            StartCoroutine(DataGetter.Instance.CreateSkybox(material.mainTexture as Texture2D, material));
            Debug.Log("Skybox material loaded and applied.");
            return material;
        }
        else
        {
            Debug.LogWarning("No saved skybox material found.");
            try {
                DataGetter.Instance.GetSkyBox(id);
            } catch {
                Debug.Log("Could not load or find skybox in server");
            }
            return null;
        }
    }
}
