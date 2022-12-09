import { Directive } from 'vue';

/*

    Emits a function when clicked outside of element

 */

export const ClickOutsideDirective: Directive<any, any> = {
    mounted(el, binding) {
        el.clickOutsideEvent = function (event: any) {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event, el);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
    },
};
