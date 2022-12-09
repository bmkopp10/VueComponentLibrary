<template>
    <div class="b-form-input">
        <label v-if="label"> {{ label }} </label>
        <textarea
            id="exampleFormControlTextarea1"
            :disabled="disabled"
            :value="modelValue"
            class="form-control"
            :rows="rows"
            :maxlength="maxLength"
            @input="onInput($event)"
            @change="onChange($event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'b-form-textarea',
    props: {
        modelValue: String,
        label: String,
        formatter: { type: Function },
        lazyFormatter: { type: Boolean, default: false },
        placeholder: String,
        disabled: { type: Boolean, default: false },
        rows: {
            type: String,
            default: '3',
        },
        maxLength: { type: Number, default: undefined },
    },
    emits: ['update:modelValue', 'input', 'change'],
    setup(props, context) {
        function formatValue(value: unknown, evt: any, force = false) {
            const { formatter, lazyFormatter } = props;
            value = String(value);
            if (typeof formatter === 'function' && (!lazyFormatter || force)) {
                // @ts-ignore
                value = formatter(value, evt);
            }
            return value;
        }

        function onInput(evt: any) {
            const { value } = evt.target;
            const formattedValue = formatValue(value, evt);
            if (formattedValue === false || evt.defaultPrevented) {
                evt.preventDefault();
                return;
            }
            context.emit('update:modelValue', value);
            context.emit('input', value);
        }
        function onChange(evt: any) {
            const { value } = evt.target;
            const formattedValue = formatValue(value, evt);
            if (formattedValue === false || evt.defaultPrevented) {
                evt.preventDefault();
                return;
            }
            context.emit('change', formattedValue);
        }

        return {
            onInput,
            onChange,
        };
    },
});
</script>

<style scoped>
.b-form-input {
    text-align: left;
    width: 100%;
}

label {
    margin-left: 5px;
}
</style>
