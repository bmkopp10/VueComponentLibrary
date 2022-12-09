<template>
    <div>
        <div
            v-if="label || error"
            class="label-error-container"
        >
            <label
                v-if="error"
                class="error"
            >
                {{ error }}
            </label>
            <label v-else>
                {{ label }}
            </label>
        </div>

        <div :class="['b-form-input', {'input-group': hasAppendGroup || moreInfo}]">
            <input
                ref="input"
                :key="state.componentKey"
                :value="modelValue"
                :disabled="isDisabled"
                :required="required"
                :autocomplete="autocomplete"
                :min="min"
                :max="max"
                :step="step"
                :type="type"
                :class="['form-control', {'readonly': readonly}]"
                :placeholder="placeholder"
                @input="onInput($event)"
                @change="onChange($event)"
                @keypress="onKeyPress($event)"
                @keydown="onKeyDown($event)"
                @focus="onFocus"
                @blur="onBlur"
            >
            <div
                v-if="hasAppendGroup"
                :class="['input-group-text', {'padding-0': hasAppendGroupSlot}]"
            >
                <slot name="appendGroupText">
                    {{ appendGroupText }}
                </slot>
            </div>
            <template v-else-if="moreInfo">
                <popover use-mouse-position>
                    <div class="input-group-text ">
                        <span>
                            <faicon icon="info" />
                        </span>
                    </div>
                    <template #content>
                        {{ moreInfo }}
                    </template>
                </popover>
            </template>

            <div
                v-if="showStepper"
                class="stepper noselect"
            >
                <div
                    class="step"
                    @mousedown="numberChange(-1)"
                    @mouseup="stop"
                >
                    <span>-</span>
                </div>
                <div
                    class="step"
                    @mousedown="numberChange(1)"
                    @mouseup="stop"
                >
                    <span>+</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed, defineComponent, nextTick, onActivated, onMounted, onUpdated, PropType, reactive, ref,
} from 'vue';
import Popover from '@package/components/bootstrap-library/Popover.vue';
import useNumberIncrementer from "@/composables/useNumberIncrementer";

type InputEvaluationResult = {
    returnedValue: number | string,
    attemptedValue: number | string,
}

type State = {
    componentKey: number
}

type InputType =
    'text'
    | 'number'
    | 'email'
    | 'password'
    | 'search'
    | 'url'
    | 'tel'
    | 'date'
    | 'time'
    | 'range'
    | 'color';

interface NumberOptions {
    allowsDecimal?: boolean
    allowsNegative?: boolean
}

export default defineComponent({
    name: 'b-form-input',
    components: {
        Popover,
    },
    props: {
        modelValue: [String, Number],
        label: String,
        placeholder: String,
        autocomplete: { type: String },
        autofocus: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        readonly: { type: Boolean, default: false },
        max: Number,
        min: Number,
        step: { type: Number, default: 1 },
        type: {
            type: String as PropType<InputType>,
            default: 'text',
        },
        hideStepper: { type: Boolean, default: true },
        trim: {
            type: Boolean,
            default: true,
        },
        number: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        error: String,
        appendGroupText: String,
        numberOptions: Object as PropType<NumberOptions>,
        moreInfo: String,
        preventTyping: Boolean,
    },
    emits: ['update:modelValue', 'change', 'input', 'keypress', 'focus', 'blur'],
    setup(props, context) {
        const input = ref<HTMLElement>();
        const state = reactive<State>({
            componentKey: 0,
        });

        // lifecycle events
        const handleAutofocus = () => {
            nextTick(() => {
                if (props.autofocus) {
                    input.value?.focus();
                }
            });
        };

        onMounted(handleAutofocus);
        onActivated(handleAutofocus);
        onUpdated(handleAutofocus);

        function onInput(evt: Event) {
            const { value } = evt.target as HTMLTextAreaElement;
            context.emit('input', value);
        }

        function onKeyPress(event: KeyboardEvent) {
            if (props.type === 'number' && !isValidKeyForNumber(event.key, props.numberOptions)) {
                event.preventDefault();
            } else {
                context.emit('keypress', event);
            }
        }

        function onKeyDown(event: KeyboardEvent) {
            if (props.preventTyping) {
                event.preventDefault();
            }
        }

        function onChange(evt: Event) {
            const inputElValue = (evt.target as HTMLTextAreaElement).value;
            let formattedValue: number | string = inputElValue;

            if (props.type === 'number') {
                formattedValue = convertToNumber(inputElValue);
            }

            const { attemptedValue, returnedValue } = evaluateMaxMin(formattedValue);
            const valueToEmit = returnedValue;

            context.emit('update:modelValue', valueToEmit);
            context.emit('change', valueToEmit, attemptedValue);

            if (attemptedValue !== returnedValue) {
                state.componentKey++;
            }
        }

        function onFocus() {
            context.emit('focus');
        }

        function onBlur() {
            // check if text box should be trimmed
            if (props.trim && typeof props.modelValue === 'string') {
                const trimmed = props.modelValue.trim();

                // if trim made a difference, set input element to new value and emit events
                if (props.modelValue !== trimmed) {
                    context.emit('update:modelValue', trimmed);
                    context.emit('input', trimmed);
                    context.emit('change', trimmed);
                }
            }

            context.emit('blur');
        }

        const isDisabled = computed(() => props.disabled || props.readonly);

        const showStepper = computed((): boolean => !(props.hideStepper || props.type !== 'number'));

        function handleStep(value: number) {
            if (props.type === 'number') {
                const stepFactor = value * props.step;
                const modelValue: number = convertToNumber(props.modelValue);

                const { returnedValue } = evaluateMaxMin(modelValue + stepFactor);

                context.emit('update:modelValue', returnedValue);
                context.emit('input', returnedValue);
                context.emit('change', returnedValue);
            }
        }

        function isValidKeyForNumber(keyboardKey: string, numberOptions?: NumberOptions): boolean {
            if (numberOptions?.allowsDecimal && keyboardKey === '.') {
                return true;
            }

            if (numberOptions?.allowsNegative && keyboardKey === '-') {
                return true;
            }

            return !!(keyboardKey.match(/^\d$/));
        }

        const { stop, numberChange } = useNumberIncrementer({ changeCallback: handleStep });

        function convertToNumber(value: string | number | undefined): number {
            return !value ? 0 : typeof value === 'number' ? value : parseFloat(value);
        }

        function evaluateMaxMin(value: number | string): InputEvaluationResult {
            const result: InputEvaluationResult = { attemptedValue: value, returnedValue: value };
            if (typeof value === 'number') {
                if (props.min && value < props.min) {
                    result.returnedValue = props.min;
                }
                if (props.max && value > props.max) {
                    result.returnedValue = props.max;
                }
                return result;
            }
            return result;
        }

        const hasAppendGroupSlot = computed((): boolean => !!context.slots.appendGroupText);

        const hasAppendGroup = computed((): boolean => !!props.appendGroupText || hasAppendGroupSlot.value);

        return {
            input,
            onInput,
            onKeyPress,
            onChange,
            onFocus,
            onBlur,
            onKeyDown,
            isDisabled,
            showStepper,
            stop,
            numberChange,
            state,
            hasAppendGroup,
            hasAppendGroupSlot,
        };
    },
});
</script>

<style lang="scss" scoped>
.b-form-input {
    text-align: left;
    width: 100%;
    position: relative;

    .readonly {
        background: transparent !important;
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0 !important;
        padding-left: 5px;
        padding-bottom: 0;
        padding-top: 10px;
    }

    .popover-container {
        .input-group-text {
            font-size: .75em;
            border-radius: inherit;
        }
    }
}

label {
    margin-left: 5px;
}

.step {
    display: none;
    margin: auto;
    width: 20px;
    height: 100%;
}

.stepper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
}

.b-form-input:hover {

    .step {
        display: flex;

        span {
            margin: auto;
        }

    }
}

.label-error-container {
    text-align: left;
}

/* hide native stepper */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type=number] {
    -moz-appearance: textfield;
}
</style>
