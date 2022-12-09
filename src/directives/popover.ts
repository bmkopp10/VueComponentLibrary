import { Directive } from 'vue';

const duration = 250;
let hoverTimeout: NodeJS.Timer | undefined = undefined;

function createCloseListeners(el: HTMLElement) {
    el.addEventListener('mouseleave', () => hideSimplePopover(el));
    el.addEventListener('scroll', () => hideSimplePopover(el));
    el.addEventListener('click', () => hideSimplePopover(el));
}

// These SHOULD be being destroyed, have not confirmed though.  Unsure if it's destroyed when using arrow functions
function destroyCloseListeners(el: HTMLElement) {
    el.removeEventListener('mouseleave', () => hideSimplePopover(el));
    el.removeEventListener('scroll', () => hideSimplePopover(el));
    el.removeEventListener('click', () => hideSimplePopover(el));
}

// for mobile/touch device
function hasTouch() {
    return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        // || navigator.msMaxTouchPoints > 0;
}

function showSimplePopover(el: HTMLElement, text: string) {
    const { top } = el.getBoundingClientRect();
    const right = el.getBoundingClientRect().right + 10;
    const simplePopover = document.createElement('div');
    const content = document.createTextNode(text);
    simplePopover.appendChild(content);
    simplePopover.setAttribute('id', 'custom-simple-popover');
    simplePopover.style.position = 'fixed';
    simplePopover.style.left = `${right}px`;
    simplePopover.style.top = `${top}px`;
    simplePopover.style.fontWeight = 'normal';
    simplePopover.style.color = 'white';
    simplePopover.style.zIndex = '9999';
    simplePopover.style.padding = '7px 20px';
    simplePopover.style.background = 'rgba(80, 80 , 80)';
    simplePopover.style.borderRadius = '3px';
    simplePopover.style.width = '200px';
    simplePopover.style.fontSize = '13px';
    document.body.appendChild(simplePopover);
    createCloseListeners(el);
}

function hideSimplePopover(el: HTMLElement) {
    clearTimeout(hoverTimeout);
    const element = document.getElementById('custom-simple-popover');
    if (element) {
        (element.parentElement as any).removeChild(element);
    }
    destroyCloseListeners(el);
}

function onMouseEnter(el: HTMLElement, text: string) {
    hideSimplePopover(el);

    hoverTimeout = setTimeout(() => {
        showSimplePopover(el, text);
    }, duration);
}

export const PopoverDirective: Directive<any, any> = {
    mounted(el: HTMLElement, binding) {
        if (!binding.modifiers.hover) {
            throw new Error('simple-popover must include modifier (hover)');
        }
        const text = binding.value;
        if (text) {
            if (binding.modifiers.hover && !hasTouch()) {
                el.addEventListener('mouseenter', () => onMouseEnter(el, text));
            }
        }
    },
    beforeUnmount(el: HTMLElement) {
        hideSimplePopover(el); // probably wont happen, but make sure the popover is always removed on unmount
        // This SHOULD be being destroyed, have not confirmed though.  Unsure if it's destroyed when using arrow functions
        el.removeEventListener('mouseenter', () => onMouseEnter(el, ''));
    },
};
