import { Directive } from 'vue';

/*

    Adds an id to the element that is used to find element only in testing

 */

export const TestDirective: Directive<any, any> = {
    mounted(el, binding, vnode) {
        if (process.env.NODE_ENV !== 'production') {
            Object.keys(binding.value).forEach((value) => {
                el.setAttribute(`data-test-${value}`, binding.value[value]);
            });
        }
    },
};
