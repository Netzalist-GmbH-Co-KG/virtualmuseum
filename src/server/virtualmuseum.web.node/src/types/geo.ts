import { LabeledEntity, NamedEntity } from './common';

export interface TimeSeries extends NamedEntity {
    Name: string; // Override to make it required
    Description: string; // Override to make it required
}

export interface GeoEventGroup extends LabeledEntity {
    TimeSeriesId: string;
}

export interface GeoEvent extends LabeledEntity {
    GeoEventGroupId: string;
    MultimediaPresentationId: string | null;
    DateTime: string;
    Latitude: number;
    Longitude: number;
}
