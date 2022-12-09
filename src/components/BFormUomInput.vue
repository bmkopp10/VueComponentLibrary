<template>
    <b-col
        :cols="cols"
        :lg="lg"
        :md="md"
        :sm="sm"
        :xs="xs"
    >
        <b-form-input
            v-bind="$props"
            :model-value="value"
            :number-options="{ allowsDecimal: true }"
            type="number"
            hide-stepper
            @change="handleChange"
        >
            <!-- why do i have to use value here?-->
            <template #appendGroupText>
                <b-form-select
                    v-model="uom.displayedUnitOfMeasure.value"
                    :options="uom.measureOptions.value"
                    class="uom-select"
                    :readonly="!uom.hasMultipleOptions()"
                    @change="onChangeMeasurement"
                />
            </template>
        </b-form-input>
    </b-col>
</template>

<script lang="ts">
import {
    defineComponent, nextTick, PropType, ref,
} from 'vue';
import BFormInput from './BFormInput.vue';
import BFormSelect from './BFormSelect.vue';
import {UseUnitOfMeasure} from "@/measurement/types";

export default defineComponent({  
    name: 'b-form-uom-input',
    components: { BFormInput, BFormSelect },
    extends: BFormInput,
    emits: ['change', 'update:modelValue'],
    props: {
        cols: String,
        lg: String,
        md: String,
        sm: String,
        xs: String,
        modelValue: { type: Number, required: true },
        uom: { type: Object as PropType<UseUnitOfMeasure>, required: true },
    },
    setup(props, context) {
        const value = ref(props.uom.convertFromBase(props.modelValue));

        function handleChange(val: number) {
            value.value = val;
            context.emit('change', props.uom.convertToBase(val));
            context.emit('update:modelValue', props.uom.convertToBase(val));
        }

        function onChangeMeasurement() {
            nextTick(() => {
                value.value = props.uom.convertFromBase(props.modelValue);
            });
        }

        return {
            handleChange,
            value,
            onChangeMeasurement,
        };
    },
});
</script>

<style scoped lang="scss">
.uom-select {
    background-color: #e9ecef;
    border:none;
    box-shadow: none!important;
    cursor: pointer;

    &.readonly {
        cursor: initial;
        padding: 0.375rem 1rem 0.375rem 0.75rem;
    }
}
</style>
