using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Server;
using Server.Data;
using TMPro;
using UnityEngine;
using UnityEngine.Experimental.Rendering;
using UnityEngine.UI;

[RequireComponent(typeof(ConfigurationManager))]
public class TestScript : MonoBehaviour
{
    List<Room> rooms;
    Room firstRoom;
    TopographicalTableConfiguration tableConfiguration;
    InventoryPlacement tablePlacement;
    public byte[] imageData;

    public TMP_Text logText;

    public Texture2D texture;
    public Material skyboxMaterial;
    
    private ConfigurationManager configurationManager;
    // Start is called before the first frame update
    void Start()
    {
        configurationManager = GetComponent<ConfigurationManager>();
        LoadConfiguration()
            .ContinueWith( task=> Debug.LogError(task.Exception), TaskContinuationOptions.OnlyOnFaulted);
    }
    
    async Task LoadConfiguration()
    {
        rooms = await configurationManager.ConfigurationClient.GetRooms();
        Debug.Log("Rooms:");
        Debug.Log(JsonConvert.SerializeObject(rooms, Formatting.Indented));
        if(rooms.Count==0)
            return;
        firstRoom = await configurationManager.ConfigurationClient.GetRoom(rooms[0].Id);
        Debug.Log($"First Room: {firstRoom.Label} ");
        
        tablePlacement = firstRoom.InventoryPlacements.FirstOrDefault( p=>p.InventoryItem?.TypeOfItem=="TOPOGRAPHICAL_TABLE");
        Debug.Log($"Table Placement: {tablePlacement?.InventoryItem?.TypeOfItem}");
        if(tablePlacement==null)
            return;
        tableConfiguration = await configurationManager.ConfigurationClient.GetTableConfiguration(tablePlacement.InventoryItem!.Id);
        Debug.Log($"Table Configuration: {tableConfiguration.Label} {tableConfiguration.LocationTimeRows.Count} rows");

        Debug.Log($"First Row: {tableConfiguration.LocationTimeRows[0].Label}");
        List<MediaFile> mediaFile = tableConfiguration.LocationTimeRows[0].GeoEvents[0].MediaFiles;
        Debug.Log(mediaFile.Count());

        await configurationManager.ConfigurationClient.GetMedia(tableConfiguration.LocationTimeRows[0].GeoEvents[0].MediaFiles[0].Id, MediaCallBack);
    }

    async public void MediaCallBack(byte[] data){
        texture = new Texture2D(2, 2);
        texture.LoadImage(data);

        // Step 2: Save the Texture2D as a JPEG File
        SaveAsJPEG();

        // Step 3: Read and Modify the JPEG File
        LoadAndModifyJPEG();
        StartCoroutine(CreateSkybox());
    
    }

    void SaveAsJPEG()
    {
        byte[] bytes = texture.EncodeToJPG();
        File.WriteAllBytes(Application.persistentDataPath + "/image.jpg", bytes);
        Debug.Log("Image saved to " + Application.persistentDataPath + "/image.jpg");
    }

    void LoadAndModifyJPEG()
    {
        byte[] fileData = File.ReadAllBytes(Application.persistentDataPath + "/image.jpg");
        texture = new Texture2D(Screen.width, Screen.height);
        texture.LoadImage(fileData);

        // Modify the texture (optional)
        // Perform any modifications here

        // Save the modified texture
        byte[] bytes = texture.EncodeToJPG();
        File.WriteAllBytes(Application.persistentDataPath + "/image_modified.jpg", bytes);
        Debug.Log("Modified image saved to " + Application.persistentDataPath + "/image_modified.jpg");
    }

    IEnumerator CreateSkybox(){
        // Create a new Cubemap
        int cubemapSize = DetermineCubemapSize(texture.width, texture.height);

        // Create a new Cubemap
        Cubemap cubemap = new Cubemap(cubemapSize, TextureFormat.RGBA32, false);

        // Convert the equirectangular panorama to cubemap
        yield return StartCoroutine(ConvertEquirectangularToCubemap(texture, cubemap));

        // Assign the cubemap to the skybox material
        skyboxMaterial.SetTexture("_Tex", cubemap);

        // Set the skybox material as the active skybox
        RenderSettings.skybox = skyboxMaterial;
    }

    int DetermineCubemapSize(int panoramaWidth, int panoramaHeight)
    {
        int size = Mathf.Min(panoramaWidth / 4, panoramaHeight / 2);
        size = Mathf.ClosestPowerOfTwo(size); // Ensure the size is a power of two
        return Mathf.Clamp(size, 512, 2048); // Clamp the size to a reasonable range
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

                // Yield after processing each row to spread the workload
                if (y % 10 == 0)
                {
                    logText.text = $"Processing row {face}: " + (y + 1) + " of " + cubemap.height;
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