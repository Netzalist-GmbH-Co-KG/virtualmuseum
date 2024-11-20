# TimeglideVR / Virtual Museum application

## Overview

This is the backend nodejs application for TimeglideVR application.

TimeglideVR is an extended realtity application which allows visitors
of a real museum to experience interactive, virtual elements whithin
the real space of the museum.

## Model

The concepts ( hierarchy ) are as follows: Detailed database schema can be found in [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

### Tenants / Phyisical layouts

Tenant
    |
    |--- Room
        |
        |--- InventoryItem
            is a
            |
            |--- TopographicalTable
            |--- More Types to be defined later

A tenant is a defined as a real museum and as such a customer of the TimeglideVR application.

Witin each museum / tenant there can be one or more rooms defined which will
be identified later through spatial anchors in the main app (the headset "knows" in which room it is).

Within each room one or more inventory items can be defined which will be placed relative to the spatial anchor of the room.

#### Inventory Items

This is supposed to be expandable. An inventory item is kind of the "Base class" for certain assets. The only asset at this point is the topographical table. So a topographical table is an inventory item and shares the same primary key.

#### Topographical Table

TopographicalTable
    |
    |--- TopographicalTableTopic
        |
        |--- TopographicalTableTopicTimeSeries

A topopgraphical table can display different topics. A topic displays a
specific topographical map and can then visualize a list of time series which can be displayed on that map.

Example Topics are "The state of Thuringia" or "The city of Schmalkalden".
They represent a certain region which will be displayed.

An Example for a TimeSeries is "Founding years of all towns in Thuringia" ". 

### TimeSeries

TimeSeries
    |
    |--- GeoEventGroup
        |
        |--- GeoEvent

A TimeSeries is a collection of GeoEvents which are grouped together within a GeoEventGroup.

The user will be able to switch on and off GeoEventGroups, but not single GeoEvents. So there will be a kind of "button" for each GeoEventGroup.

The Geoevents themselves have longitudes and latitudes which will be used to display the GeoEvents on the map in the right spot.


### MultiMediaPresentations

MultiMediaPresentations
    |
    |--- PresentationItems
        |
        |--- MediaFile

A MultimediaPresentation is a collection of MediaFiles which can be displayed in different locations (slots) in parallel.

MediaFiles can be audio, video or images. Video and Images can be 2D, 3D or 360 degrees which will be displayed accordingly.

The media / binary data itself is stored on a CDN and the urls are stored in the database.

The PresentationItems link a MediaFile to a slot in a MultiMediaPresentation and determine the sequence and duration (when and how long it is displayed / played).

MultiMediaPresentations can be linked to a GeoEvent. If that GeoEvent is visible, the user can play the presentation interactively.

## API

### Commands and Queries

#### Description

We do not use a RESTful API, but rather a command / query system. The commands are defined in the [COMMANDS.md](COMMANDS.md) and the queries in the [QUERIES.md](QUERIES.md).
The idea is to be able to create a complete command history (EventSourcing) for auditing purposes and to be able to roll back to any previous state.

We do not use EventSourcing on the query side though to rehydrate to any previous state. The commands will persist the state in a normal relational database.

#### History

All commands will be stored in a history table as serialized JSON objects with timestamps, a command id (string) and a version number (int). Queries will not be stored.