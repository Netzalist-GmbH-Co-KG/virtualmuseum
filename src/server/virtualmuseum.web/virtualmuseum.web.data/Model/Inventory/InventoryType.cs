using System.Runtime.Serialization;

namespace virtualmuseum.web.data;

public enum InventoryType
{
    [EnumMember(Value = "TopographicalTable")]
    TopographicalTable,
}