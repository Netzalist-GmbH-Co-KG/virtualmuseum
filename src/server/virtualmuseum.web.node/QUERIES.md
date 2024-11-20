# Queries

## Description

This is a list of all Query endpoints in the API.

## Endpoints

### GET /api/tenants

Returns all tenants with their associated rooms and inventory items.

**Authentication:**
- Requires API key in header: `x-api-key`

**Response:**
```typescript
{
    Id: string;          // Tenant ID
    Name: string;        // Tenant name
    rooms: {
        Id: string;      // Room ID
        TenantId: string;// Reference to parent tenant
        Label: string | null;
        Description: string | null;
        inventoryItems: {
            Id: string;  // Inventory item ID
            RoomId: string; // Reference to parent room
            Name: string | null;
            Description: string | null;
            InventoryType: number;
            PositionX: number;
            PositionY: number;
            PositionZ: number;
            RotationX: number;
            RotationY: number;
            RotationZ: number;
            ScaleX: number;
            ScaleY: number;
            ScaleZ: number;
        }[];
    }[];
}[]
```

**Example Response:**
```json
[
    {
        "Id": "tenant-1",
        "Name": "Museum Wing A",
        "rooms": [
            {
                "Id": "room-1",
                "TenantId": "tenant-1",
                "Label": "Exhibition Hall",
                "Description": "Main exhibition space",
                "inventoryItems": [
                    {
                        "Id": "item-1",
                        "RoomId": "room-1",
                        "Name": "Display Case",
                        "Description": "Glass display case for artifacts",
                        "InventoryType": 1,
                        "PositionX": 10.5,
                        "PositionY": 0,
                        "PositionZ": 5.2,
                        "RotationX": 0,
                        "RotationY": 90,
                        "RotationZ": 0,
                        "ScaleX": 1,
                        "ScaleY": 1,
                        "ScaleZ": 1
                    }
                ]
            }
        ]
    }
]
