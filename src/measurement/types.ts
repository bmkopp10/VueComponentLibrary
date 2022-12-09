import { ComputedRef, Ref } from 'vue';
import {UOMMetaData} from "../types";

export type UOMSystem = 'imperial' | 'metric';
export type UOMType = 'weight' | 'length';
export type UOMSpatialType = 'linear' | 'square' | 'cubic';
export type UOMWeight = 'pounds';
export type UOMLength = 'inches' | 'feet';

export type UseUnitOfMeasure = {
    displayedUnitOfMeasure: Ref<UOMWeight | UOMLength>;
    convertToBase: (val: number) => number;
    convertFromBase: (val: number) => number;
    measureOptions: ComputedRef<Array<UOMLength> | Array<UOMWeight>>;
    toggleUnitOfMeasure: () => void;
    hasMultipleOptions: () => boolean;
    uomMetaData: UOMMetaData;
};

export type UseUnitOfMeasureForItem = {
    useItemHeightUom?: UseUnitOfMeasure
    useItemLengthUom?: UseUnitOfMeasure
    useItemWidthUom?: UseUnitOfMeasure
    useItemWeightUom?: UseUnitOfMeasure
    useItemCollapsedHeightUom?: UseUnitOfMeasure
};
