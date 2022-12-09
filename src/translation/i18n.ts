import { createI18n } from 'vue-i18n';
import { navEn, navEs, NavTranslation } from '../translation/nav';
import { buttonEn, buttonEs, ButtonTranslation } from '../translation/button';
import { commonEn, commonEs, CommonTranslation } from '../translation/common';
import { selectOptionsEn, selectOptionsEs, SelectOptionsTranslation } from '../translation/selectOptions';
import { domainEn, domainEs, DomainTranslation } from '../translation/domain';
import { validationEn, validationEs, ValidationTranslation } from '../translation/validation';

type TranslationMessage = {
    en: TranslationSchema;
    es: TranslationSchema;
};

type TranslationSchema = {
    core: {
        nav: NavTranslation;
        button: ButtonTranslation;
        selectOptions: SelectOptionsTranslation;
        domain: DomainTranslation;
        common: CommonTranslation;
        validation: ValidationTranslation;
    };
};

const messages: TranslationMessage = {
    en: {
        core: {
            nav: navEn,
            button: buttonEn,
            selectOptions: selectOptionsEn,
            domain: domainEn,
            common: commonEn,
            validation: validationEn,
        },
    },
    es: {
        core: {
            nav: navEs,
            button: buttonEs,
            selectOptions: selectOptionsEs,
            domain: domainEs,
            common: commonEs,
            validation: validationEs,
        },
    },
};

const i18n = createI18n<TranslationMessage, 'en' | 'es'>({
    locale: 'en',
    messages,
    legacy: false,
    globalInjection: true,
});

export { messages, i18n };
