import { BaseEntity } from './common';

export enum InventoryType {
    Unknown = 0,
    TopographicalTable = 1,
}

export interface InventoryItem extends BaseEntity {
    RoomId: string;
    Name: string | null;
    Description: string | null;
    InventoryType: InventoryType;
    PositionX: number;
    PositionY: number;
    PositionZ: number;
    RotationX: number;
    RotationY: number;
    RotationZ: number;
    ScaleX: number;
    ScaleY: number;
    ScaleZ: number;
}

export interface TopographicalTable extends BaseEntity {
}

export interface TopographicalTableTopic extends BaseEntity {
    TopographicalTableId: string;
    Topic: string;
    Description: string | null;
    MediaFileImage2DId: string | null;
}

export interface  TopographicalTableTopicTimeSeries extends BaseEntity {
    TimeSeriesId: string;
    TopographicalTableTopicId: string;
}
