# VR Museum Administration Application - Database Analysis

## Overview

This document contains key findings and references for the VR museum administration application. The application is designed to manage content for a VR application based on Unity for a local museum. The VR application displays time series data on a topological table and can play multimedia presentations attached to "GeoEvents".

## Database Schema

The application uses a SQLite database (`virtualmuseum.db`) with the following tables:

### Core Entities

1. **Tenants**
   - `Id` (TEXT, PK)
   - `Name` (TEXT, NOT NULL)
   - Represents museum organizations

2. **Rooms**
   - `Id` (TEXT, PK)
   - `TenantId` (TEXT, NOT NULL)
   - `Label` (TEXT)
   - `Description` (TEXT)
   - Represents physical spaces in the museum
   - Linked to Tenants via TenantId

3. **InventoryItems**
   - `Id` (TEXT, PK)
   - `RoomId` (TEXT, NOT NULL)
   - `Name` (TEXT)
   - `Description` (TEXT)
   - `InventoryType` (INTEGER, NOT NULL)
   - Position/Rotation/Scale coordinates (REAL, NOT NULL)
   - Represents items placed in rooms
   - Linked to Rooms via RoomId

### Topographical Tables

4. **TopographicalTables**
   - `Id` (TEXT, PK)
   - Special inventory items
   - Implicitly linked to InventoryItems through InventoryType

5. **TopographicalTableTopics**
   - `Id` (TEXT, PK)
   - `TopographicalTableId` (TEXT, NOT NULL)
   - `Topic` (TEXT, NOT NULL)
   - `Description` (TEXT, NOT NULL)
   - `MediaFileImage2DId` (TEXT)
   - Topics displayed on topographical tables
   - Linked to TopographicalTables via TopographicalTableId

### Time Series and Events

6. **TimeSeries**
   - `Id` (TEXT, PK)
   - `Name` (TEXT, NOT NULL)
   - `Description` (TEXT, NOT NULL)
   - Collections of geo events

7. **TopographicalTableTopicTimeSeries**
   - `Id` (TEXT, PK)
   - `TimeSeriesId` (TEXT, NOT NULL)
   - `TopographicalTableTopicId` (TEXT, NOT NULL)
   - Junction table linking topics to time series
   - Creates many-to-many relationship between topics and time series

8. **GeoEventGroups**
   - `Id` (TEXT, PK)
   - `Label` (TEXT)
   - `Description` (TEXT)
   - `TimeSeriesId` (TEXT, NOT NULL)
   - Groups of geographical events within a time series
   - Linked to TimeSeries via TimeSeriesId

9. **GeoEvents**
   - `Id` (TEXT, PK)
   - `GeoEventGroupId` (TEXT)
   - `MultiMediaPresentationId` (TEXT)
   - `Name` (TEXT)
   - `Description` (TEXT)
   - `DateTime` (TEXT, NOT NULL)
   - `Latitude` (REAL, NOT NULL)
   - `Longitude` (REAL, NOT NULL)
   - Individual geographical events
   - Linked to GeoEventGroups via GeoEventGroupId
   - Can be linked to MultimediaPresentations via MultiMediaPresentationId

### Multimedia

10. **MultimediaPresentations**
    - `Id` (TEXT, PK)
    - `Name` (TEXT)
    - `Description` (TEXT)
    - Collections of media presentations

11. **PresentationItems**
    - `Id` (TEXT, PK)
    - `MultimediaPresentationId` (TEXT, NOT NULL)
    - `MediaFileId` (TEXT)
    - `SlotNumber` (INTEGER, NOT NULL)
    - `SequenceNumber` (INTEGER, NOT NULL)
    - `DurationInSeconds` (INTEGER, NOT NULL)
    - Individual items in a multimedia presentation
    - Linked to MultimediaPresentations via MultimediaPresentationId
    - Linked to MediaFiles via MediaFileId

12. **MediaFiles**
    - `Id` (TEXT, PK)
    - `Description` (TEXT)
    - `DurationInSeconds` (REAL, NOT NULL)
    - `FileName` (TEXT)
    - `Name` (TEXT)
    - `Type` (INTEGER, NOT NULL)
    - `Url` (TEXT)
    - Media content (images, videos, audio)

### Authentication

13. **UserRoles**
    - `Id` (INTEGER, PK, AUTOINCREMENT)
    - `UserId` (TEXT, NOT NULL)
    - `Username` (TEXT, NOT NULL)
    - `Role` (TEXT, NOT NULL)
    - User authentication and authorization

## Project Structure

The Next.js application is organized by feature:

- `/app/rooms` - Room management
- `/app/inventory` - Inventory item management
- `/app/time-series` - Time series management
- `/app/presentations` - Multimedia presentation management
- `/app/media` - Media file management

Currently, these components use mock data rather than connecting to the SQLite database.

## Entity Relationships

The application follows a hierarchical structure:

1. Tenants contain Rooms
2. Rooms contain InventoryItems
3. InventoryItems can be TopographicalTables
4. TopographicalTables have Topics
5. Topics reference TimeSeries
6. TimeSeries contain GeoEventGroups
7. GeoEventGroups contain GeoEvents
8. GeoEvents can link to MultimediaPresentations
9. MultimediaPresentations contain PresentationItems
10. PresentationItems reference MediaFiles

## Multimedia Presentation Slots

According to the system overview:

- SlotNumber 0 is Audio Only
- SlotNumber 1 is a 360 degree "dome" to play 360 degree photos or videos
- Slotnumber 2...n are flat displays to show images or videos on

## Technology Stack

- **Frontend**: Next.js with Shadcn UI components
- **Backend**: C# (.NET) with Entity Framework (indicated by "__EFMigrationsHistory" table)
- **Database**: SQLite

## Implementation Status

The frontend is currently using mock data. The next step is to connect the frontend to the SQLite database to enable real data management.

## References

- Database Schema: `db/virtualmuseum.db`
- System Overview: `ai-docs/SystemOverview.md`
