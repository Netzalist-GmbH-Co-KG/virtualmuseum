// Base type for all entities with an Id
export interface BaseEntity {
    Id: string;
}

// Base type for entities with name and description
export interface NamedEntity extends BaseEntity {
    Name: string | null;
    Description: string | null;
}

// Base type for entities with label and description
export interface LabeledEntity extends BaseEntity {
    Label: string | null;
    Description: string | null;
}
