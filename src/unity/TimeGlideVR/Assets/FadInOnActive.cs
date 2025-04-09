using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using UnityEngine;

public class FadInOnActive : MonoBehaviour
{
    [SerializeField] private Material _material;
    
    void OnEnable()
    {
        FadeIn(1f);
    }
    
    public void FadeIn(float seconds){
        StartCoroutine(FadeInCoroutine(seconds));
        
    }

    private IEnumerator FadeInCoroutine(float seconds)
    {
        float time = 0;
        Color currentMatColor = new Color(_material.color.r, _material.color.g, _material.color.b, 0f);
        _material.color = currentMatColor;
        while (time < seconds)
        {
            time += Time.deltaTime;
            currentMatColor.a = time / seconds;
            _material.color = currentMatColor;
            yield return null;
        }
    }
    
}