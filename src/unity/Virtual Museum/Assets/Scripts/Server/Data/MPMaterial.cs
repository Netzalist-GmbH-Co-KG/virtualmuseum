using UnityEngine;
using MessagePack;
using UnityEditor;

[MessagePackObject]
public class MPMaterial : MonoBehaviour
{
    [Key(0)]
    public string ShaderName { get; set; }
    
    [Key(1)]
    public Color Color { get; set; }
    
    [Key(2)]
    public float FloatProperty { get; set; }
    
    [Key(3)]
    public string TexturePath { get; set; }

    public MPMaterial(Material material)
    {
        ShaderName = material.shader.name;
        Color = material.color;
        FloatProperty = material.GetFloat("_FloatProperty"); // Example property
        TexturePath = AssetDatabase.GetAssetPath(material.mainTexture);
    }

    public Material ToMaterial()
    {
        Material material = new Material(Shader.Find(ShaderName));
        material.color = Color;
        material.SetFloat("_FloatProperty", FloatProperty); // Example property
        if (!string.IsNullOrEmpty(TexturePath))
        {
            material.mainTexture = AssetDatabase.LoadAssetAtPath<Texture2D>(TexturePath);
        }
        return material;
    }
}
