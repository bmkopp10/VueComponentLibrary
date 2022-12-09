import { UOMLength } from '../measurement/types';

export function inchesToFeet(value: number): number {
    return value / 12;
}

export function feetToInches(value: number): number {
    return value * 12;
}

export function convertToInches(value: number, measurementFrom: UOMLength): number {
    switch (measurementFrom) {
    case 'inches':
        return value;
    case 'feet':
        return feetToInches(value);
    default:
        console.warn('Unable to map conversion');
        return value;
    }
}

export function convertFromInches(value: number, measurementTo: UOMLength): number {
    switch (measurementTo) {
    case 'inches':
        return value;
    case 'feet':
        return inchesToFeet(value);
    default:
        console.warn('Unable to map conversion');
        return value;
    }
}
