import {DynamicVariant} from "./src/types";

export type ColorScheme = {
    primary: string;
    secondary: string;
    tertiary: string;
    primaryInverse: string;
    secondaryInverse: string;
    tertiaryInverse: string;
};

export default class ThemeCreator {
    private readonly _primary: Array<number>;

    private readonly _primaryInverse: Array<number>;

    private readonly _secondary: Array<number>;

    private readonly _secondaryInverse: Array<number>;

    private readonly _tertiary: Array<number>;

    private readonly _tertiaryInverse: Array<number>;

    private readonly _borderRadius: string = '2px';

    private opacity = 30;

    constructor(scheme: ColorScheme, borderRadius?: number) {
        this._primary = this.convertColorToNumberArray(scheme.primary);
        this._primaryInverse = this.convertColorToNumberArray(scheme.primaryInverse);
        this._secondary = this.convertColorToNumberArray(scheme.secondary);
        this._secondaryInverse = this.convertColorToNumberArray(scheme.secondaryInverse);
        this._tertiary = this.convertColorToNumberArray(scheme.tertiary);
        this._tertiaryInverse = this.convertColorToNumberArray(scheme.tertiaryInverse);
        if (borderRadius) this._borderRadius = this.numberToStringPx(borderRadius);
    }

    public init() {
        this.setBorderRadius();
        this.setColorByVariant(this._primary, 'primary');
        this.setColorByVariant(this._secondary, 'secondary');
        this.setColorByVariant(this._tertiary, 'tertiary');
        // inverse colors dont need opacity, so for now i'll just leave them here.  Not sure what's best.
        document.documentElement.style.setProperty('--color-primary-inverse', this.toRBG(this._primaryInverse));
        document.documentElement.style.setProperty('--color-secondary-inverse', this.toRBG(this._secondaryInverse));
        document.documentElement.style.setProperty('--color-tertiary-inverse', this.toRBG(this._tertiaryInverse));
    }

    private setColorByVariant(rgbArray: Array<number>, variant: DynamicVariant) {
        document.documentElement.style.setProperty(`--color-${variant}`, this.toRBG(rgbArray));
        document.documentElement.style.setProperty(`--color-${variant}-opacity`, this.toRBG(rgbArray, this.opacity));
    }

    private convertColorToNumberArray(colorString: string): number[] {
        return colorString.split(',').map((color) => Number(color));
    }

    private toRBG(rgbArray: Array<number>, opacity?: number): string {
        if (this.isValid(rgbArray)) {
            const r = rgbArray[0];
            const g = rgbArray[1];
            const b = rgbArray[2];
            return `rgba(${r} ${g} ${b} / ${opacity || 100}%)`;
        }
        throw new Error('Invalid color');
    }

    private setBorderRadius() {
        document.documentElement.style.setProperty('--border-radius', this._borderRadius);
    }

    private numberToStringPx(val: number): string {
        return `${val}px`;
    }

    private isValid(val: Array<number>): boolean {
        if (val.length !== 3) {
            throw new Error('Invalid color');
        }
        val.forEach((num) => {
            if (num > 255 || num < 0) {
                throw new Error('Invalid rgb color');
            }
        });
        return true;
    }
}
