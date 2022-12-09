export type ValidationTranslation = {
    isRequired: string;
    cannotBeEmpty: string;
    oneOrMoreErrors: string;
};

const validationEn: ValidationTranslation = {
    isRequired: 'is required',
    cannotBeEmpty: 'cannot be empty',
    oneOrMoreErrors: 'there were 1 or more errors on the form',
};

const validationEs: ValidationTranslation = {
    isRequired: 'requerido',
    cannotBeEmpty: 'no puede estar vacío',
    oneOrMoreErrors: 'hubo 1 o mas errores en el formulario',
};

export { validationEn, validationEs };
