<template>
    <teleport to="body">
        <div
            :id="id"
            ref="element"
            class="modal"
            :class="classes"
            tabindex="-1"
        >
            <div
                class="modal-dialog"
                :class="modalDialogClasses"
            >
                <div class="modal-content">
                    <div
                        v-if="!hideHeader"
                        class="modal-header"
                    >
                        <h5 class="modal-title">
                            <slot name="title">
                                {{ title }}
                            </slot>
                        </h5>
                        <button
                            v-if="!hideHeaderClose"
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div class="modal-body">
                        <div v-if="modelValue">
                            <slot />
                        </div>
                    </div>
                    <div
                        v-if="!hideFooter"
                        class="modal-footer"
                    >
                        <slot name="footer">
                            <slot name="btn-cancel">
                                <b-button
                                    variant="light"
                                    data-bs-dismiss="modal"
                                    @click="$emit('cancel')"
                                >
                                    {{ cancelButton }}
                                </b-button>
                            </slot>
                            <slot name="btn-ok">
                                <b-button
                                    variant="primary"
                                    data-bs-dismiss="modal"
                                    @click="$emit('ok')"
                                >
                                    {{ okButton }}
                                </b-button>
                            </slot>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import {
    computed, defineComponent, onBeforeUnmount, onMounted, ref, watch,
} from 'vue';
import { Modal } from 'bootstrap';
import BButton from '@package/components/bootstrap-library/BButton.vue';
import useEventListener from "../../composables/useEventListener";

export default defineComponent({
    name: 'b-modal',
    components: {
        BButton,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        noBackdrop: {
            type: Boolean,
            default: false,
        },
        centered: {
            type: Boolean,
            default: false,
        },
        fade: {
            type: Boolean,
            default: false,
        },
        fullscreen: {
            type: [Boolean, String],
            default: false,
        },
        id: { type: String },
        title: { type: String },
        okButton: { type: String, default: () => 'Ok' },
        cancelButton: { type: String, default: () => 'Cancel' },
        scrollable: {
            type: Boolean,
            default: false,
        },
        show: {
            type: Boolean,
            default: false,
        },
        size: { type: String },
        staticBackdrop: { type: Boolean }, // prevents closing modal when clicking backdrop
        hideFooter: { type: Boolean, default: () => false },
        hideHeader: { type: Boolean, default: () => false },
        hideHeaderClose: { type: Boolean, default: () => false },
    },
    emits: [
        'update:modelValue',
        'show',
        'shown',
        'hide',
        'hidden',
        'hide-prevented',
        'ok',
        'cancel',
    ],
    setup(props, { emit }) {
        const element = ref<HTMLElement>();
        const instance = ref<Modal>();
        const classes = computed(() => ({
            fade: props.fade,
            show: props.show,
        }));
        const modalDialogClasses = computed(() => ({
            'modal-fullscreen': typeof props.fullscreen === 'boolean' ? props.fullscreen : false,
            [`modal-fullscreen-${props.fullscreen}-down`]: typeof props.fullscreen === 'string' ? props.fullscreen : false,
            [`modal-${props.size}`]: props.size,
            'modal-dialog-centered': props.centered,
            'modal-dialog-scrollable': props.scrollable,
        }));
        useEventListener(element, 'shown.bs.modal', () => {
            emit('shown');
            // prefer to avoid direct DOM interaction. but required here because of how this singleton works
            const btn: HTMLCollectionOf<Element> | undefined = element.value?.getElementsByClassName('btn-primary');
            if (btn?.length) {
                (btn[0] as HTMLElement).focus();
            }
        });
        useEventListener(element, 'hidden.bs.modal', () => emit('hidden'));
        useEventListener(element, 'hidePrevented.bs.modal', () => emit('hide-prevented'));
        useEventListener(element, 'show.bs.modal', () => {
            emit('show');
            emit('update:modelValue', true);
        });
        useEventListener(element, 'hide.bs.modal', () => {
            emit('hide');
            emit('update:modelValue', false);
        });
        onMounted(() => {
            instance.value = new Modal(element.value as HTMLElement, {
                backdrop: props.staticBackdrop ? 'static' : !props.noBackdrop,
                keyboard: !props.staticBackdrop,
            });
            if (props.modelValue) {
                instance.value?.show();
            }
        });
        // if you dont close the modal in the correct order, sometimes the modal-backdrop persists
        // this is probably due to the element being teleported outside to the body
        // i think this is an OK fix for now
        onBeforeUnmount(() => {
            const elements = document.getElementsByClassName('modal-backdrop');
            for (const el of elements) {
                el.remove();
            }
        });
        watch(() => props.modelValue, (value) => {
            if (value) {
                instance.value?.show();
            } else {
                instance.value?.hide();
            }
        });

        return {
            element,
            classes,
            modalDialogClasses,
        };
    },
});
</script>
<style lang="scss" scoped>
.modal {
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

.modal-content {
    border-radius: 0;
}
</style>
