using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChangeTableMat : MonoBehaviour
{
    public MeshRenderer meshRenderer;
    public int targetMatToChangeIndex = 0;
    public Material[] tableMats;

    public void ChangeTableMatTo(int index = 0)
    {
        Debug.Log("called");
        var temp = meshRenderer.materials;
        temp[targetMatToChangeIndex] = tableMats[index];
        meshRenderer.materials = temp;
    }
}
