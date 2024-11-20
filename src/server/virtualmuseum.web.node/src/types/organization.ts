import { BaseEntity, LabeledEntity } from './common';

export interface Tenant extends BaseEntity {
    Name: string;
}

export interface Room extends LabeledEntity {
    TenantId: string;
}

export interface UserRole extends BaseEntity {
    UserId: string;
    RoleId: string;
}
