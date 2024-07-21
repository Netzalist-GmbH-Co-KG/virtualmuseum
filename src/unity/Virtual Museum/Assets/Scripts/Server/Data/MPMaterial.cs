using UnityEngine;
using MessagePack;
using System.IO;

[MessagePackObject]
public class MPMaterial
{
    [Key(0)]
    public string ShaderName { get; set; }

    [Key(1)]
    public Color Color { get; set; }

    [Key(2)]
    public byte[] TextureData { get; set; }

    public MPMaterial(Material material)
    {
        ShaderName = material.shader.name;
        Color = material.color;

        if (material.mainTexture is Texture2D mainTexture)
        {
            TextureData = ImageConversion.EncodeToPNG(mainTexture);
        }
    }

    public Material ToMaterial()
    {
        Material material = new Material(Shader.Find(ShaderName));
        material.color = Color;

        if (TextureData != null && TextureData.Length > 0)
        {
            Texture2D tex = new Texture2D(2, 2);
            tex.LoadImage(TextureData);
            material.mainTexture = tex;
        }

        return material;
    }
}
