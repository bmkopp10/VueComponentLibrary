import { computed, ref } from 'vue';
import {
    UOMLength, UOMWeight, UseUnitOfMeasure
} from '../measurement/types';
import { convertFromInches, convertToInches } from '../measurement/conversions';
import {UOMMetaData} from "../types";
import {moveNext} from "../functions/array";
import {roundUpToTenth} from "../functions/round";


const defaultLength: UOMLength = 'inches'; // for now this isn't changeable
const defaultWeight: UOMWeight = 'pounds'; // for now this isn't changeable

export default function useUnitOfMeasure(uomMetaData: UOMMetaData): UseUnitOfMeasure {
    function getDefaultUOM(metaData: UOMMetaData): UOMWeight | UOMLength {
        // TODO: need good error handling

        if (metaData.type === 'weight') {
            if (metaData.measure) return metaData.measure;
            return defaultWeight;
        }

        if (metaData.type === 'length') {
            if (metaData.measure) return metaData.measure;
            return defaultLength;
        }

        throw new Error('Bad type');
    }

    const defaultUnitOfMeasure = getDefaultUOM(uomMetaData);
    const displayedUnitOfMeasure = ref<UOMWeight | UOMLength>(defaultUnitOfMeasure);

    const lengthOptions: Array<UOMLength> = ['inches', 'feet'];
    const weightOptions: Array<UOMWeight> = ['pounds'];

    const measureOptions = computed((): Array<UOMLength> | Array<UOMWeight> => {
        if (uomMetaData.type === 'weight') return weightOptions;
        if (uomMetaData.type === 'length') return lengthOptions;
        return [];
    });

    function convertToBase(value: number): number {
        const measurementFrom: UOMLength = displayedUnitOfMeasure.value as UOMLength; // we know this is length in this instance
        switch (uomMetaData.spacial) {
        case 'linear':
            return convertToInches(value, measurementFrom);
        case 'square':
            return convertToInches(convertToInches(value, measurementFrom), measurementFrom);
        case 'cubic':
            return convertToInches(convertToInches(convertToInches(value, measurementFrom), measurementFrom), measurementFrom);
        default:
            // conversion isn't defined, so return original value. could happen if a UOM only has one measurement defined
            return value;
        }
    }

    function convertFromBase(value: number): number {
        const measurementTo: UOMLength = displayedUnitOfMeasure.value as UOMLength; // we know this is length in this instance
        switch (uomMetaData.spacial) {
        case 'linear':
            return convertFromInches(value, measurementTo);
        case 'square':
            return convertFromInches(convertFromInches(value, measurementTo), measurementTo);
        case 'cubic':
            return convertFromInches(convertFromInches(convertFromInches(value, measurementTo), measurementTo), measurementTo);
        default:
            // conversion isn't defined, so return original value. could happen if a UOM only has one measurement defined
            return value;
        }
    }

    function toggleUnitOfMeasureLength() {
        displayedUnitOfMeasure.value = moveNext<UOMLength>(displayedUnitOfMeasure.value as UOMLength, lengthOptions);
    }

    function toggleUnitOfMeasureWeight() {
        displayedUnitOfMeasure.value = moveNext<UOMWeight>(displayedUnitOfMeasure.value as UOMWeight, weightOptions);
    }

    function toggleUnitOfMeasure() {
        if (uomMetaData.type === 'length') {
            toggleUnitOfMeasureLength();
        }
        if (uomMetaData.type === 'weight') {
            toggleUnitOfMeasureWeight();
        }
    }

    function hasMultipleOptions() {
        return measureOptions.value?.length > 1;
    }

    return {
        displayedUnitOfMeasure,
        convertToBase: (num) => roundUpToTenth(convertToBase(num)),
        convertFromBase: (num) => roundUpToTenth(convertFromBase(num)),
        measureOptions,
        toggleUnitOfMeasure,
        hasMultipleOptions,
        uomMetaData,
    };
}
