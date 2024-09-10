using System.Runtime.Serialization;

namespace virtualmuseum.web.data;

public enum MediaType
{
    [EnumMember(Value = "2DImage")]
    Image2D,
    [EnumMember(Value = "3DImage")]
    Image3D,
    [EnumMember(Value = "360DegreeImage")]
    Image360Degree,
    [EnumMember(Value = "2DVideo")]
    Video2D,
    [EnumMember(Value = "3DVideo")]
    Video3D,
    [EnumMember(Value = "360DegreeVideo")]
    Video360Degree
}