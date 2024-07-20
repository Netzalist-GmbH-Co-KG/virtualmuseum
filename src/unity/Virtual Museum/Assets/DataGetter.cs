using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Oculus.Platform;
using Server;
using Server.Data;
using TMPro;
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
    private bool running = false;

    List<Guid> imagesToLoad = new List<Guid>();

    async Task GetImage(Guid id, ServerRequestCallBack callback = null){
        if(running){
            imagesToLoad.Add(id);
            return;
        }
        running = true;
        currentID = id;
        if(callback != null){
            await configurationManager.ConfigurationClient.GetImage(id, ImageCallback);
        } else {
            await configurationManager.ConfigurationClient.GetImage(id, callback);
        }
    }

    public async void ImageCallback(byte[] data){
        var texture = new Texture2D(2, 2);
        texture.LoadImage(data);

        try {
            DataSaver.Instance.SaveAsJPEG(texture, currentID);
        } catch {
            Debug.Log("Failed to save image");
        }
        running = false;

        if(imagesToLoad.Count > 0){
            await GetImage(imagesToLoad[0]);
            imagesToLoad.RemoveAt(0);
        }
    }

    public async void GetSkyBox(Guid imageID){
        await GetImage(imageID, SkyBoxImageCallback);
    }

    public void SkyBoxImageCallback(byte[] data){
        var texture = new Texture2D(2, 2);
        texture.LoadImage(data);
        Material skyboxMaterial = new Material(Shader.Find("Skybox/Cubemap"));
        StartCoroutine(CreateSkybox(texture, skyboxMaterial));
    }

    IEnumerator CreateSkybox(Texture2D texture, Material skyboxMaterial){
        int cubemapSize = DetermineCubemapSize(texture.width, texture.height);
        Cubemap cubemap = new Cubemap(cubemapSize, TextureFormat.RGBA32, false);
        yield return StartCoroutine(ConvertEquirectangularToCubemap(texture, cubemap));
        skyboxMaterial.SetTexture("_Tex", cubemap);
        DataSaver.Instance.SaveAsMaterial(skyboxMaterial, currentID);
    }

    int DetermineCubemapSize(int panoramaWidth, int panoramaHeight)
    {
        int size = Mathf.Min(panoramaWidth / 4, panoramaHeight / 2);
        size = Mathf.ClosestPowerOfTwo(size);
        return Mathf.Clamp(size, 512, 2048); 
    }

    IEnumerator ConvertEquirectangularToCubemap(Texture2D panorama, Cubemap cubemap)
    {
        for (int face = 0; face < 6; face++)
        {
            CubemapFace cubemapFace = (CubemapFace)face;
            Color[] facePixels = new Color[cubemap.width * cubemap.height];

            for (int y = 0; y < cubemap.height; y++)
            {
                for (int x = 0; x < cubemap.width; x++)
                {
                    Vector3 direction = CubemapUVToDirection(cubemapFace, x, y, cubemap.width);
                    facePixels[y * cubemap.width + x] = SampleEquirectangular(panorama, direction);
                }

                //spread the workload -> probably doable in a shader
                if (y % 10 == 0)
                {
                    //Debug.Log($"Processing row {face}: " + (y + 1) + " of " + cubemap.height);
                    yield return null;
                }
            }

            cubemap.SetPixels(facePixels, cubemapFace);
        }

        cubemap.Apply();
    }

    Vector3 CubemapUVToDirection(CubemapFace face, int x, int y, int size)
    {
        float u = (x + 0.5f) / size * 2f - 1f;
        float v = (y + 0.5f) / size * 2f - 1f;
        Vector3 direction = Vector3.zero;

        switch (face)
        {
            case CubemapFace.PositiveX: direction = new Vector3(1, -v, -u); break;
            case CubemapFace.NegativeX: direction = new Vector3(-1, -v, u); break;
            case CubemapFace.PositiveY: direction = new Vector3(u, 1, v); break;
            case CubemapFace.NegativeY: direction = new Vector3(u, -1, -v); break;
            case CubemapFace.PositiveZ: direction = new Vector3(u, -v, 1); break;
            case CubemapFace.NegativeZ: direction = new Vector3(-u, -v, -1); break;
        }

        return direction.normalized;
    }

    Color SampleEquirectangular(Texture2D panorama, Vector3 direction)
    {
        float theta = Mathf.Atan2(direction.z, direction.x);
        float phi = Mathf.Acos(direction.y);

        float u = (theta + Mathf.PI) / (2 * Mathf.PI);
        float v = 1.0f - phi / Mathf.PI; // Flip the v coordinate

        return panorama.GetPixelBilinear(u, v);
    }
}