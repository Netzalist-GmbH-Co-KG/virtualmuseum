using UnityEngine;
using System;
using System.Collections;
using TimeGlideVR.Server;
using TimeGlideVR.Server.WebClient;
using TMPro;

public class CheckConnection : MonoBehaviour
{
    private ConfigurationManager _configurationManager;
    [SerializeField]
    private TextMeshPro _disconnectedText;
    
    void OnEnable()
    {
        Debug.Log("CheckConnection enabled - starting coroutine");
        StartCoroutine(CheckConnectionCoroutine());
    }

    private IEnumerator CheckConnectionCoroutine()
    {
        while (true)
        {
            try
            {
                if (_configurationManager == null) 
                {
                    _configurationManager = FindObjectOfType<ConfigurationManager>();
                    Debug.Log($"ConfigurationManager found: {_configurationManager != null}");
                }
                
                if (_configurationManager == null)
                {
                    _disconnectedText.text = "No ConfigurationManager found";
                    Debug.Log("No ConfigurationManager - showing disconnected sign");
                }
                else
                {
                    _disconnectedText.text = _configurationManager.ConnectionState == ConnectionState.Connected ? $"Connected to: {ConfigurationManager.GetApiUrlForEnvironment(EnvironmentSettings.CurrentEnvironmentName)}" : $"Disconnected from server {ConfigurationManager.GetApiUrlForEnvironment(EnvironmentSettings.CurrentEnvironmentName)}";
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Error in connection check: {e}");
            }

            yield return new WaitForSeconds(5);
        }
    }

    void OnDisable()
    {
        Debug.Log("CheckConnection component disabled");
    }

    void OnDestroy()
    {
        Debug.Log("CheckConnection component destroyed");
    }
}