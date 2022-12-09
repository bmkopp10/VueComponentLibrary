import { ConcreteComponent, UnwrapRef } from 'vue';
import {UOMLength, UOMSpatialType, UOMType, UOMWeight, UseUnitOfMeasure} from "../measurement/types";

export type Module = {
    name: string;
    routes: any;
    start?: () => Promise<boolean>;
};

export type Option = {
    text: string;
    value: string | number;
    disabled?: boolean;
};

export type DynamicVariant = 'primary' | 'secondary' | 'tertiary';

export type StaticVariant = 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark';

export type Variant = DynamicVariant | StaticVariant;

export interface FormDefinition<T> {
    key: keyof T;
    type: 'string' | 'number' | 'boolean' | 'date' | 'array' | UseUnitOfMeasure;
    label?: string;
    listProps?: {
        options: Array<any>;
        value: string;
        text: string | Array<string>;
    };
    required?: boolean;
    disabled?: boolean;
    autofocus?: boolean;
}

export type ColumnDefinition<T> = {
    // Keep in sync with BTableField until consolidated
    key: keyof T | Array<string>;
    label?: string;
    searchable?: boolean;
    formatter?: (value: any) => any;
    ignoreSort?: boolean;
    width?: string;
    hidden?: boolean;
    uom?: UseUnitOfMeasure;
    headerBadge?: ConcreteComponent;
    align?: 'left' | 'center' | 'right';
};

export type TableButton<T> = {
    function: (item: T) => void;
    icon?: string;
    title: string;
    variant?: Variant
};

export interface TableDefinition<T> {
    key: string;
    name: string;
    items: UnwrapRef<Array<T>>;
    columnDefinition: Array<ColumnDefinition<T>>;
    sidePane?: ConcreteComponent;
    headIcon?: ConcreteComponent;
}

export type MetaData = {
    uom?: UOMMetaData;
};

export type UOMMetaData = {
    type: UOMType;
    measure?: UOMLength | UOMWeight;
    spacial?: UOMSpatialType
};
