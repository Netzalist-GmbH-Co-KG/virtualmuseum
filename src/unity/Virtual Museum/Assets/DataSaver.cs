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

    public void SaveAsMaterial(Material material, Guid id)
    {
        MPMaterial serializableMaterial = new MPMaterial(material);
        byte[] bytes = MessagePackSerializer.Serialize(serializableMaterial);

        string path = Path.Combine(Application.persistentDataPath, $"/media/material{id}.dat");
        File.WriteAllBytes(path, bytes);

        Debug.Log($"Material saved to {path}");
    }

    public void SaveAsJPEG(Texture2D texture, Guid? id = null)
    {
        if(id == null) id = Guid.NewGuid();
        byte[] bytes = texture.EncodeToJPG();
        File.WriteAllBytes(Application.persistentDataPath + $"/media/image{id}.jpg", bytes);
        Debug.Log("Image saved to " + Application.persistentDataPath + $"/media/image{id}.jpg");
    }

    public void SaveAsMP3(AudioClip audioClip, Guid? id = null){
        if(id == null) id = Guid.NewGuid();
        ConvertAndWrite(audioClip, Application.persistentDataPath + $"/media/audio{id}.mp3");
    }

    private static void ConvertAndWrite (AudioClip clip, string path){
        float[] samples = new float[clip.samples * clip.channels];
        clip.GetData (samples, 0);
        Int16[] intData = new Int16[samples.Length];
        //converting in 2 float[] steps to Int16[], //then Int16[] to Byte[]
        Byte[] bytesData = new Byte[samples.Length * 2];
        //bytesData array is twice the size of
        //dataSource array because a float converted in Int16 is 2 bytes.
        float rescaleFactor = 32767; //to convert float to Int16
        for (int i = 0; i < samples.Length; i++) {
            intData[i] = (short)(samples[i] * rescaleFactor);
            Byte[] byteArr = new Byte[2];
            byteArr = BitConverter.GetBytes(intData[i]);
            byteArr.CopyTo(bytesData, i * 2);
        }

        File.WriteAllBytes (path, GetClipData(clip));
    }

    public static byte[] GetClipData(AudioClip _clip)
    {
        //Get data
        float[] floatData = new float[_clip.samples * _clip.channels];
        _clip.GetData(floatData, 0);

        //convert to byte array
        byte[] byteData = new byte[floatData.Length * 4];
        Buffer.BlockCopy(floatData, 0, byteData, 0, byteData.Length);

        return (byteData);
    }
}