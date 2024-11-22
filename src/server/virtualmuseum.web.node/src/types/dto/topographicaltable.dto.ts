import {
    TopographicalTable,
    TopographicalTableTopic,
    GeoEvent, 
    GeoEventGroup, 
    TimeSeries
} from '../';

import { MultimediaPresentationWithPresentationItems } from './multimediapresentation.dt';


export interface GeoEventWithMultimediaPresentation extends GeoEvent {
    MultimediaPresentation: MultimediaPresentationWithPresentationItems
}

export interface GeoEventGroupWithEventsAndMultimediaPresentation extends GeoEventGroup {
    GeoEvents: GeoEventWithMultimediaPresentation[],
}

export interface TimeSeriesWithEventsAndMultimediaPresentation extends TimeSeries {
    GeoEventGroups: GeoEventGroupWithEventsAndMultimediaPresentation[],
}

export interface TopographicalTopicWithTimeSeries extends TopographicalTableTopic {
    TimeSeries: TimeSeriesWithEventsAndMultimediaPresentation[],
}

export interface TopographicalTableWithTopics extends TopographicalTable {
    Topics: TopographicalTopicWithTimeSeries[],
}