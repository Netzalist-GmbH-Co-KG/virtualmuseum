# SCHEMA FOR virualmuseum.db

## TABLES

CREATE TABLE "GeoEventGroups" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_GeoEventGroups" PRIMARY KEY,
    "Label" TEXT NULL,
    "Description" TEXT NULL,
    "TimeSeriesId" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    FOREIGN KEY ("TimeSeriesId") REFERENCES "TimeSeries"("Id")
)
CREATE UNIQUE INDEX `sqlite_autoindex_GeoEventGroups_1` ON `GeoEventGroups` (Id);

### GeoEvents

CREATE TABLE "GeoEvents" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_GeoEvents" PRIMARY KEY,
    "GeoEventGroupId" TEXT NOT NULL,
    "MultimediaPresentationId" TEXT NULL,
    "Label" TEXT NULL,
    "Description" TEXT NULL,
    "DateTime" TEXT NOT NULL,
    "Latitude" REAL NOT NULL,
    "Longitude" REAL NOT NULL,
    FOREIGN KEY ("GeoEventGroupId") REFERENCES "GeoEventGroups"("Id"),
    FOREIGN KEY ("MultimediaPresentationId") REFERENCES "MultimediaPresentations"("Id")
)
CREATE UNIQUE INDEX `sqlite_autoindex_GeoEvents_1` ON `GeoEvents` (Id);
### InventoryItems

CREATE TABLE "InventoryItems" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_InventoryItems" PRIMARY KEY,
    "RoomId" TEXT NOT NULL,
    "Name" TEXT NULL,
    "Description" TEXT NULL,
    "InventoryType" INTEGER NOT NULL,
    "PositionX" REAL NOT NULL,
    "PositionY" REAL NOT NULL,
    "PositionZ" REAL NOT NULL,
    "RotationX" REAL NOT NULL,
    "RotationY" REAL NOT NULL,
    "RotationZ" REAL NOT NULL,
    "ScaleX" REAL NOT NULL,
    "ScaleY" REAL NOT NULL,
    "ScaleZ" REAL NOT NULL,
    FOREIGN KEY ("RoomId") REFERENCES "Rooms"("Id")
)
CREATE UNIQUE INDEX `sqlite_autoindex_InventoryItems_1` ON `InventoryItems` (Id);

### MediaFiles

CREATE TABLE "MediaFiles" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_MediaFiles" PRIMARY KEY,
    "Description" TEXT NULL,
    "DurationInSeconds" REAL NOT NULL,
    "FileName" TEXT NULL,
    "Name" TEXT NULL,
    "Type" INTEGER NOT NULL,
    "Url" TEXT NULL
)
CREATE UNIQUE INDEX `sqlite_autoindex_MediaFiles_1` ON `MediaFiles` (Id);

### MultiMediaPresentations

CREATE TABLE "MultimediaPresentations" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_MultimediaPresentations" PRIMARY KEY,
    "Name" TEXT NULL,
    "Description" TEXT NULL
)
CREATE UNIQUE INDEX `sqlite_autoindex_MultimediaPresentations_1` ON `MultimediaPresentations` (Id);

### PresentationItems

CREATE TABLE "PresentationItems" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_PresentationItems" PRIMARY KEY,
    "MultimediaPresentationId" TEXT NOT NULL,
    "MediaFileId" TEXT NULL,
    "SlotNumber" INTEGER NOT NULL,
    "SequenceNumber" INTEGER NOT NULL,
    "DurationInSeconds" INTEGER NOT NULL,
    FOREIGN KEY ("MultimediaPresentationId") REFERENCES "MultimediaPresentations"("Id"),
    FOREIGN KEY ("MediaFileId") REFERENCES "MediaFiles"("Id")
)
CREATE UNIQUE INDEX `sqlite_autoindex_PresentationItems_1` ON `PresentationItems` (Id);

### Rooms

CREATE TABLE "Rooms" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Rooms" PRIMARY KEY,
    "TenantId" TEXT NOT NULL,
    "Label" TEXT NULL,
    "Description" TEXT NULL,
    FOREIGN KEY ("TenantId") REFERENCES "Tenants"("Id")
)
CREATE UNIQUE INDEX `sqlite_autoindex_Rooms_1` ON `Rooms` (Id);

### Tenants

CREATE TABLE "Tenants" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Tenants" PRIMARY KEY,
    "Name" TEXT NOT NULL
)
CREATE UNIQUE INDEX `sqlite_autoindex_Tenants_1` ON `Tenants` (Id);

### TimeSeries

CREATE TABLE "TimeSeries" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_TimeSeries" PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL
)
CREATE UNIQUE INDEX `sqlite_autoindex_TimeSeries_1` ON `TimeSeries` (Id);

### TopographicalTables

CREATE TABLE "TopographicalTables" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_TopographicalTables" PRIMARY KEY,
    FOREIGN KEY ("Id") REFERENCES "InventoryItems"("Id")
)
CREATE UNIQUE INDEX `sqlite_autoindex_TopographicalTables_1` ON `TopographicalTables` (Id);

### TopographicalTableTopics

CREATE TABLE "TopographicalTableTopics" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_TopographicalTableTopics" PRIMARY KEY,
    "TopographicalTableId" TEXT NOT NULL,
    "Topic" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "MediaFileImage2DId" TEXT NULL,
    FOREIGN KEY ("TopographicalTableId") REFERENCES "TopographicalTables"("Id"),
    FOREIGN KEY ("MediaFileImage2DId") REFERENCES "MediaFiles"("Id")
)
CREATE UNIQUE INDEX `sqlite_autoindex_TopographicalTableTopics_1` ON `TopographicalTableTopics` (Id);

### TopographicalTableTopicTimeSeries

CREATE TABLE "TopographicalTableTopicTimeSeries" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_TopographicalTableTopicTimeSeries" PRIMARY KEY,
    "TimeSeriesId" TEXT NOT NULL,
    "TopographicalTableTopicId" TEXT NOT NULL,
    FOREIGN KEY ("TimeSeriesId") REFERENCES "TimeSeries"("Id"),
    FOREIGN KEY ("TopographicalTableTopicId") REFERENCES "TopographicalTableTopics"("Id")
)
CREATE UNIQUE INDEX `sqlite_autoindex_TopographicalTableTopicTimeSeries_1` ON `TopographicalTableTopicTimeSeries` (Id);

### UserRoles

CREATE TABLE "UserRoles" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_UserRoles" PRIMARY KEY AUTOINCREMENT,
    "UserId" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Role" TEXT NOT NULL
)

### CommandHistory

CREATE TABLE "CommandHistory" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_CommandHistory" PRIMARY KEY,
    "CommandType" TEXT NOT NULL,
    "CommandData" TEXT NOT NULL,  -- Serialized JSON of the command
    "SchemaVersion" INTEGER NOT NULL,  -- Command schema version for future compatibility
    "Timestamp" TEXT NOT NULL     -- ISO 8601 format
):
CREATE INDEX "IX_CommandHistory_Timestamp" ON "CommandHistory"("Timestamp");
CREATE INDEX "IX_CommandHistory_CommandType" ON "CommandHistory"("CommandType");