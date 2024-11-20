import { LabeledEntity } from './common';

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
