import { BaseEntity, NamedEntity } from './common';

export enum MediaType {
    Unknown = 0,
    Image2D = 0,
    Image3D = 1,
    Image360Degree = 2,
    Video2D = 3,
    Video3D = 4,
    Video360Degree = 5,
    Audio = 6
}

export interface MediaFile extends NamedEntity {
    DurationInSeconds: number;
    FileName: string | null;
    Type: MediaType;
    Url: string | null;
}

export interface MultimediaPresentation extends NamedEntity {}

export interface PresentationItem extends BaseEntity {
    MultimediaPresentationId: string;
    MediaFileId: string | null;
    SlotNumber: number;
    SequenceNumber: number;
    DurationInSeconds: number;
}
