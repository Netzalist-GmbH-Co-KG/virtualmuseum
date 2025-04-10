export interface GeoEvent {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  latitude: number;
  longitude: number;
  hasMultimediaPresentation: boolean;
  multimediaPresentationId: string | null;
}

export interface GeoEventGroup {
  id: string;
  label: string;
  description: string;
  geoEvents: GeoEvent[];
}

export interface PresentationOption {
  id: string;
  name: string;
}

export interface TimeSeries {
  id: string;
  name: string;
  description: string;
  geoEventGroups: GeoEventGroup[];
  presentationOptions: PresentationOption[];
}
