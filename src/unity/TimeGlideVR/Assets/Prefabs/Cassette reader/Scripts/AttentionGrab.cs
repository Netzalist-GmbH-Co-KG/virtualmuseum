using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class AttentionGrab : MonoBehaviour
{
    private List<Material> oldMats = new List<Material>();
    public void SetMaterial (Material mat){
        var mr = GetComponent<MeshRenderer>();
        oldMats = mr.materials.ToList();
        var materials = mr.materials;
        List<Material> materials1 = new List<Material>();
        materials1.Add(mat);
        materials1.AddRange(materials);
        mr.materials = materials1.ToArray();
    }

    public void ResetMaterial(){
        var mr = GetComponent<MeshRenderer>();
        mr.materials = oldMats.ToArray();
    }
}
