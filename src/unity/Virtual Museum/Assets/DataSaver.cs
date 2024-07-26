using System;
using System.IO;
using Server;
using UnityEngine;

[RequireComponent(typeof(ConfigurationManager))]
[RequireComponent(typeof(RoomConfig))]
public class DataSaver : MonoBehaviour
{
    public static DataSaver Instance { get; private set; }

    private void Awake() 
    { 
        p = Application.persistentDataPath + "/";
        RoomPath = p + $"rooms/room{RoomConfig.currentRoomId}/rooms/";
        ImagePath = p + $"rooms/room{RoomConfig.currentRoomId}/media/2DImages/";
        CubemapPath = p + $"rooms/room{RoomConfig.currentRoomId}/media/cubemaps/";
        AudioPath = p + $"rooms/room{RoomConfig.currentRoomId}/media/audioClips/";
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

    static string p;
    public static string RoomPath;
    public static string ImagePath;
    public static string CubemapPath;
    public static string AudioPath;

    private void CheckIfFilePathsExist(){
        if(!Directory.Exists(p + $"rooms")) CreateFilePath(p + "rooms");
        if(!Directory.Exists(p + $"rooms/room{RoomConfig.currentRoomId}")) CreateFilePath(p + $"rooms/room{RoomConfig.currentRoomId}");
        if(!Directory.Exists(p + $"rooms/room{RoomConfig.currentRoomId}/media")) CreateFilePath(p + $"rooms/room{RoomConfig.currentRoomId}/media");
        if(!Directory.Exists(p + $"rooms/room{RoomConfig.currentRoomId}/media/2DImages")) CreateFilePath(p + $"rooms/room{RoomConfig.currentRoomId}/media/2DImages");
        if(!Directory.Exists(p + $"rooms/room{RoomConfig.currentRoomId}/media/cubemaps")) CreateFilePath(p + $"rooms/room{RoomConfig.currentRoomId}/media/cubemaps");
        if(!Directory.Exists(p + $"rooms/room{RoomConfig.currentRoomId}/media/audioClips")) CreateFilePath(p + $"rooms/room{RoomConfig.currentRoomId}/media/audioClips");
    }

    private void CreateFilePath(string path){
        Directory.CreateDirectory(path);
        Debug.Log("Created missing directory: " + path);
    }


    public void SaveAsPNG(Texture2D texture, Guid? id = null)
    {
        if (id == null) id = Guid.NewGuid();
        byte[] bytes = texture.EncodeToPNG();
        string path = Path.Combine(ImagePath + $"image{id}.png");
        File.WriteAllBytes(path, bytes);
        Debug.Log("Image saved to " + path);
    }

    public void SaveAsMP3(AudioClip audioClip, Guid? id = null)
    {
        ConvertAndWriteAudio(audioClip, Path.Combine(AudioPath + $"audio{id}.mp3"));
    }

    private static void ConvertAndWriteAudio(AudioClip clip, string path)
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
