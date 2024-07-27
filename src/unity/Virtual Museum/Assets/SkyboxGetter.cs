using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Server;
using UnityEngine;

[RequireComponent(typeof(ConfigurationManager))]
[RequireComponent(typeof(SkyBoxLoader))]
public class SkyboxGetter : MonoBehaviour
{
    private Cubemap cubemap;
    public Material skyBoxMaterial;
    public Material voronoiMaterial;
    private Guid currentID;
    private ConfigurationManager configurationManager;
    public AudioClip narrationAudio;
    public AudioSource parentAudioSource;
    private bool skyboxApplied = false;

    private async void Awake() 
    {
        voronoiMaterial.SetFloat("_Float", -1);
        LTDescr l = LeanTween.value(-1, 1, 2f).setOnUpdate((float val) => {
            voronoiMaterial.SetFloat("_Float", val);
        }).setOnComplete(StartUp);
    }

    private async void StartUp(){
        GetComponent<MeshRenderer>().SetMaterials(new List<Material>{skyBoxMaterial, voronoiMaterial});
        configurationManager = GetComponent<ConfigurationManager>();
        int cubemapSize = 1024;
        cubemap = new Cubemap(cubemapSize, TextureFormat.RGBA32, false);
        
        currentID = RoomConfig.mediaId;
        //Check if a skybox with the same id already exists
        Debug.Log("Trying to get skybox from Drive");
        if(!GetComponent<SkyBoxLoader>().CubeMapLoad(cubemap, currentID)){
            Debug.Log("No Skybox found trying to get one from Server");
            await GetSkyBox();
        }
    }

    private void Update() {
        if(!skyboxApplied){
            return;
        }
        skyboxApplied = false;
        skyBoxMaterial.SetTexture("_Tex", cubemap);
        LTDescr l = LeanTween.value(1, -1, 2f).setOnUpdate((float val) => {
            voronoiMaterial.SetFloat("_Float", val);
        }).setOnComplete(StartAudio);
    }

    public void StartAudio(){
        if(narrationAudio){
            parentAudioSource.clip = narrationAudio;
            parentAudioSource.Play();
        }
    }

    async Task GetSkyBox(){

        //wait for configurationClient to be initialized
        while(configurationManager.ConfigurationClient == null){
            await Task.Yield();
        } 
        await configurationManager.ConfigurationClient.GetImage(currentID, SkyBoxImageCallback);
    }

    public void SkyBoxImageCallback(byte[] data){
        var texture = new Texture2D(2, 2);
        texture.LoadImage(data);
        StartCoroutine(CreateSkybox(texture));
    }

    public IEnumerator CreateSkybox(Texture2D texture){
        yield return StartCoroutine(ConvertEquirectangularToCubemap(texture, cubemap));
        skyBoxMaterial.SetTexture("_Tex", cubemap);
        skyboxApplied = true;
        GetComponent<SkyBoxLoader>().CubeMapSaveFaces(cubemap, currentID);
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
