using System;
using System.Collections;
using Server;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class TestDataLoader : MonoBehaviour
{
    private ConfigurationManager configurationManager;
    public GameObject imageSphere;
    public TMP_Text text;
    public RawImage image;
    private Texture2D texture2D;

    async void Start()
    {
        configurationManager = GetComponent<ConfigurationManager>();
        text.text = "Updating RoomConfig";
        await GetComponent<RoomConfig>().GetFirstRoom();
        RunTests();
    }

    void RunTests()
    {
        text.text = "Running tests:";
        TestSaveAndLoadCubeMap();
        TestSaveAndLoadJPEG();
    }

    void  TestSaveAndLoadCubeMap()
    {
        text.text = "TestSaveAndLoadCubeMap";
        imageSphere.SetActive(true);
    }

    async void TestSaveAndLoadJPEG()
    {
        text.text = "TestSaveAndLoadJPEG";
        await DataGetter.Instance.GetImage(RoomConfig.mediaId);
        texture2D = DataLoader.Instance.LoadImage(DataSaver.ImagePath + $"image{RoomConfig.mediaId}.png", texture2D);
        
        image.texture = texture2D;
    }


    
}