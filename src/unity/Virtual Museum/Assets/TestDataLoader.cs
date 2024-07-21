using System;
using Server;
using UnityEngine;

public class TestDataLoader : MonoBehaviour
{
    private ConfigurationManager configurationManager;
    private Guid testGuid;
    private Texture2D testTexture;
    private Material testMaterial;

    void Start()
    {
        configurationManager = GetComponent<ConfigurationManager>();
        RunTests();
    }

    void RunTests()
    {
        Debug.Log("Starting tests...");
        TestSaveAndLoadMaterial();
        TestSaveAndLoadJPEG();
        TestLoadSkybox();
    }

    void TestSaveAndLoadMaterial()
    {
        testMaterial = new Material(Shader.Find("Standard"));
        testMaterial.color = Color.red;
        testGuid = Guid.NewGuid();

        DataSaver.Instance.SaveAsMaterial(testMaterial, testGuid);
        Debug.Log("Material saved.");

        Material loadedMaterial = DataLoader.Instance.LoadMaterial(testGuid);
        Debug.Log("Material loaded.");

        if (loadedMaterial != null && loadedMaterial.color == testMaterial.color)
        {
            Debug.Log("TestSaveAndLoadMaterial passed.");
        }
        else
        {
            Debug.LogError("TestSaveAndLoadMaterial failed.");
        }
    }

    void TestSaveAndLoadJPEG()
    {
        testTexture = new Texture2D(2, 2);
        testTexture.SetPixel(0, 0, Color.red);
        testTexture.SetPixel(1, 0, Color.green);
        testTexture.SetPixel(0, 1, Color.blue);
        testTexture.SetPixel(1, 1, Color.white);
        testTexture.Apply();

        testGuid = Guid.NewGuid();
        DataSaver.Instance.SaveAsJPEG(testTexture, testGuid);
        Debug.Log("Texture saved as JPEG.");

        Texture2D loadedTexture = DataLoader.Instance.LoadImage();
        Debug.Log("Texture loaded and modified.");

        if (loadedTexture != null)
        {
            Debug.Log("TestSaveAndLoadJPEG passed.");
        }
        else
        {
            Debug.LogError("TestSaveAndLoadJPEG failed.");
        }
    }

    void TestLoadSkybox()
    {
        testMaterial = new Material(Shader.Find("Skybox/Cubemap"));
        testGuid = Guid.NewGuid();

        DataSaver.Instance.SaveAsMaterial(testMaterial, testGuid);
        Debug.Log("Skybox material saved.");

        Material loadedSkyboxMaterial = DataLoader.Instance.LoadSkybox(testGuid);
        Debug.Log("Skybox material loaded.");

        if (loadedSkyboxMaterial != null)
        {
            Debug.Log("TestLoadSkybox passed.");
        }
        else
        {
            Debug.LogError("TestLoadSkybox failed.");
        }
    }
}

