export function moveNext<T>(value: T, array: Array<T>): T {
    const index = array.findIndex((d) => d === value);
    return array[(index + 1) % array.length];
}

export function isLastIndexInArray(index: number, arrayLength: number): boolean {
    return index === arrayLength - 1;
}
