import { GeoEvent, GeoEventGroup, TimeSeries } from '../';

export interface GeoEventGroupWithEvents extends GeoEventGroup {
    GeoEvents: GeoEvent[];
}

export interface TimeSeriesWithEvents extends TimeSeries {
    GeoEventGroups: GeoEventGroupWithEvents[];
}
