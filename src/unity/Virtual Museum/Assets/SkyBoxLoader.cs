using System;
using System.IO;
using UnityEngine;

public class SkyBoxLoader : MonoBehaviour
{
    public bool CubeMapLoad(Cubemap cubemap, Guid id){
        string path = DataSaver.CubemapPath + $"cubemap{id}_NegativeX.png";
        if(File.Exists(path)){
            path = DataSaver.CubemapPath + $"cubemap{id}";
            CubeMapConvertAndLoadFacesFromPNG(cubemap, path);
            return true;
        }
        return false;
    }

    void CubeMapConvertAndLoadFacesFromPNG(Cubemap cubemap, string path){
        
        // Load the PositiveX face
        string posXPath = path + "_PositiveX.png";
        if (File.Exists(posXPath))
        {
            byte[] posXBytes = File.ReadAllBytes(posXPath);
            Texture2D posXTex = new Texture2D(cubemap.width, cubemap.height, TextureFormat.RGB24, false);
            posXTex.LoadImage(posXBytes);
            cubemap.SetPixels(posXTex.GetPixels(), CubemapFace.PositiveX);
            DestroyImmediate(posXTex);
        }

        // Load the NegativeX face
        string negXPath = path + "_NegativeX.png";
        if (File.Exists(negXPath))
        {
            byte[] negXBytes = File.ReadAllBytes(negXPath);
            Texture2D negXTex = new Texture2D(cubemap.width, cubemap.height, TextureFormat.RGB24, false);
            negXTex.LoadImage(negXBytes);
            cubemap.SetPixels(negXTex.GetPixels(), CubemapFace.NegativeX);
            DestroyImmediate(negXTex);
        }

        // Load the PositiveY face
        string posYPath = path + "_PositiveY.png";
        if (File.Exists(posYPath))
        {
            byte[] posYBytes = File.ReadAllBytes(posYPath);
            Texture2D posYTex = new Texture2D(cubemap.width, cubemap.height, TextureFormat.RGB24, false);
            posYTex.LoadImage(posYBytes);
            cubemap.SetPixels(posYTex.GetPixels(), CubemapFace.PositiveY);
            DestroyImmediate(posYTex);
        }

        // Load the NegativeY face
        string negYPath = path + "_NegativeY.png";
        if (File.Exists(negYPath))
        {
            byte[] negYBytes = File.ReadAllBytes(negYPath);
            Texture2D negYTex = new Texture2D(cubemap.width, cubemap.height, TextureFormat.RGB24, false);
            negYTex.LoadImage(negYBytes);
            cubemap.SetPixels(negYTex.GetPixels(), CubemapFace.NegativeY);
            DestroyImmediate(negYTex);
        }

        // Load the PositiveZ face
        string posZPath = path + "_PositiveZ.png";
        if (File.Exists(posZPath))
        {
            byte[] posZBytes = File.ReadAllBytes(posZPath);
            Texture2D posZTex = new Texture2D(cubemap.width, cubemap.height, TextureFormat.RGB24, false);
            posZTex.LoadImage(posZBytes);
            cubemap.SetPixels(posZTex.GetPixels(), CubemapFace.PositiveZ);
            DestroyImmediate(posZTex);
        }

        // Load the NegativeZ face
        string negZPath = path + "_NegativeZ.png";
        if (File.Exists(negZPath))
        {
            byte[] negZBytes = File.ReadAllBytes(negZPath);
            Texture2D negZTex = new Texture2D(cubemap.width, cubemap.height, TextureFormat.RGB24, false);
            negZTex.LoadImage(negZBytes);
            cubemap.SetPixels(negZTex.GetPixels(), CubemapFace.NegativeZ);
            DestroyImmediate(negZTex);
        }

        // Apply the changes to the cubemap
        cubemap.Apply();
    }


    public bool CubeMapSaveFaces(Cubemap cubemap, Guid id)
    {
        string path = DataSaver.CubemapPath;
        if(!Directory.Exists(path)){
            path = path + $"cubemap{id}";
            Debug.Log("Saving Cubemap to " + path);
            ConvertAndSaveFacesToPNG(cubemap, path);
            return true;
        }
        return false;
    }

    void ConvertAndSaveFacesToPNG(Cubemap cubemap, string path)
    {
        var tex = new Texture2D (cubemap.width, cubemap.height, TextureFormat.RGB24, false);
        // Read screen contents into the texture        
        tex.SetPixels(cubemap.GetPixels(CubemapFace.PositiveX));        
        // Encode texture into PNG
        var bytes = tex.EncodeToPNG();      
        File.WriteAllBytes(path +"_PositiveX.png", bytes);
        Debug.Log("cubemap face saved to: " + path +"_PositiveX.png");

        tex.SetPixels(cubemap.GetPixels(CubemapFace.NegativeX));
        bytes = tex.EncodeToPNG();     
        File.WriteAllBytes(path +"_NegativeX.png", bytes); 
        Debug.Log("cubemap face saved to: " + path +"_NegativeX.png");      

        tex.SetPixels(cubemap.GetPixels(CubemapFace.PositiveY));
        bytes = tex.EncodeToPNG();     
        File.WriteAllBytes(path +"_PositiveY.png", bytes);
        Debug.Log("cubemap face saved to: " + path +"_PositiveY.png");

        tex.SetPixels(cubemap.GetPixels(CubemapFace.NegativeY));
        bytes = tex.EncodeToPNG();     
        File.WriteAllBytes(path +"_NegativeY.png", bytes);      
        Debug.Log("cubemap face saved to: " + path +"_NegativeY.png"); 

        tex.SetPixels(cubemap.GetPixels(CubemapFace.PositiveZ));
        bytes = tex.EncodeToPNG();     
        File.WriteAllBytes(path +"_PositiveZ.png", bytes);      
        Debug.Log("cubemap face saved to: " + path +"_PositiveZ.png"); 

        tex.SetPixels(cubemap.GetPixels(CubemapFace.NegativeZ));
        bytes = tex.EncodeToPNG();     
        File.WriteAllBytes(path   +"_NegativeZ.png", bytes);    
        Debug.Log("cubemap face saved to: " + path +"_NegativeZ.png");   
        DestroyImmediate(tex);
    }
}
