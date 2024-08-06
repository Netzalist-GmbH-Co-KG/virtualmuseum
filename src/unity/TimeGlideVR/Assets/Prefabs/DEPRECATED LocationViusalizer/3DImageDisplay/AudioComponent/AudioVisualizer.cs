using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AudioVisualizer : MonoBehaviour
{
    public AudioSource audioSource;
    private float[] spectrum = new float[512];
    [SerializeField]
    private Material visualizerMaterial;

    void Update()
    {
    // Get audio data from the audio source
    audioSource.GetSpectrumData(spectrum, 0, FFTWindow.Blackman);
        // Convert audio data to a format suitable for the shader
    //Texture2D texture = new Texture2D(512, 1, TextureFormat.RFloat, false);
    for (int i = 1; i < spectrum.Length - 1; i++)
    {
        Debug.DrawLine(new Vector3(i - 1, spectrum[i] + 10, 0), new Vector3(i, spectrum[i + 1] + 10, 0), Color.red);
        Debug.DrawLine(new Vector3(i - 1, Mathf.Log(spectrum[i - 1]) + 10, 2), new Vector3(i, Mathf.Log(spectrum[i]) + 10, 2), Color.cyan);
        Debug.DrawLine(new Vector3(Mathf.Log(i - 1), spectrum[i - 1] - 10, 1), new Vector3(Mathf.Log(i), spectrum[i] - 10, 1), Color.green);
        Debug.DrawLine(new Vector3(Mathf.Log(i - 1), Mathf.Log(spectrum[i - 1]), 3), new Vector3(Mathf.Log(i), Mathf.Log(spectrum[i]), 3), Color.blue);
    }

    
    //texture.Apply();
    
    // Pass the texture to the shader
    //visualizerMaterial.SetTexture("_AudioTex", texture);
    }
}
