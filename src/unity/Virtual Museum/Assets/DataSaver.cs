using System;
using System.IO;
using MessagePack;
using Server;
using UnityEngine;

[RequireComponent(typeof(ConfigurationManager))]
public class DataSaver : MonoBehaviour
{
    public static DataSaver Instance { get; private set; }

    private void Awake() 
    { 
        CheckIfFilePathsExist();
        if (Instance != null && Instance != this) 
        { 
            Destroy(this); 
        } 
        else 
        { 
            Instance = this; 
        } 
    }

    private void CheckIfFilePathsExist(){
        string p = Application.persistentDataPath;
        if(!Directory.Exists(p + "rooms")) CreateFilePath(p + "rooms");
        if(!Directory.Exists(p + "media")) CreateFilePath(p + "media");
        if(!Directory.Exists(p + "media/2DImages")) CreateFilePath(p + "media/2DImages");
        if(!Directory.Exists(p + "media/Cubemaps")) CreateFilePath(p + "media/Cubemaps");
        if(!Directory.Exists(p + "media/audioClips")) CreateFilePath(p + "media/audioClips");
    }

    private void CreateFilePath(string path){
        Directory.CreateDirectory(path);
        Debug.Log("Created missing directory: " + path);
    }

    public void SaveAsMaterial(Material material, Guid id)
    {
        MPMaterial serializableMaterial = new MPMaterial(material);
        byte[] bytes = MessagePackSerializer.Serialize(serializableMaterial);

        string path = Application.persistentDataPath + "" ;
        File.WriteAllBytes(path, bytes);

        Debug.Log($"Material saved to {path}");
    }

    public void SaveAsJPEG(Texture2D texture, Guid? id = null)
    {
        if (id == null) id = Guid.NewGuid();
        byte[] bytes = texture.EncodeToJPG();
        string path = Path.Combine(Application.persistentDataPath, $"image{id}.jpg");
        File.WriteAllBytes(path, bytes);
        Debug.Log("Image saved to " + path);
    }

    public void SaveAsMP3(AudioClip audioClip, Guid? id = null)
    {
        if (id == null) id = Guid.NewGuid();
        ConvertAndWrite(audioClip, Path.Combine(Application.persistentDataPath, $"audio{id}.mp3"));
    }

    private static void ConvertAndWrite(AudioClip clip, string path)
    {
        float[] samples = new float[clip.samples * clip.channels];
        clip.GetData(samples, 0);
        Int16[] intData = new Int16[samples.Length];
        Byte[] bytesData = new Byte[samples.Length * 2];
        float rescaleFactor = 32767;
        for (int i = 0; i < samples.Length; i++)
        {
            intData[i] = (short)(samples[i] * rescaleFactor);
            Byte[] byteArr = BitConverter.GetBytes(intData[i]);
            byteArr.CopyTo(bytesData, i * 2);
        }
        File.WriteAllBytes(path, GetClipData(clip));
    }

    public static byte[] GetClipData(AudioClip clip)
    {
        float[] floatData = new float[clip.samples * clip.channels];
        clip.GetData(floatData, 0);
        byte[] byteData = new byte[floatData.Length * 4];
        Buffer.BlockCopy(floatData, 0, byteData, 0, byteData.Length);
        return byteData;
    }
}
