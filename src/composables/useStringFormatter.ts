import { FormDefinition } from '../types';

export default function useStringFormatter() {
    function camelCaseToLabel(label: string): string {
        const result = label.replace(/([A-Z])/g, ' $1');
        return result.charAt(0)
            .toUpperCase() + result.slice(1);
    }

    function getLabelFromFormDefinition(def: FormDefinition<any>): string {
        let label = '';
        if (def.label) label = def.label;
        else label = camelCaseToLabel(def.key as string);
        if (def.required) label += '*';
        return label;
    }

    function capitalizeFirstLetter(word: string): string {
        if (!word) return word;
        return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }

    function titleCase(word: string): string {
        const split = word.split(' ');
        const splitCapitalized = split.map((w) => capitalizeFirstLetter(w));
        return splitCapitalized.join(' ');
    }

    return {
        getLabelFromFormDefinition,
        camelCaseToLabel,
        capitalizeFirstLetter,
        titleCase,
    };
}
