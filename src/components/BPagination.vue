<template>
    <div class="pagination">
        <div
            class="btn-pagination btn-pagination-icon"
            @click="first"
        >
            <span>«</span>
        </div>
        <div
            class="btn-pagination btn-pagination-icon"
            @click="previous"
        >
            <span>‹</span>
        </div>
        <div
            v-for="num of numberOfPages"
            :key="num"
            :class="['btn-pagination', {'btn-pagination-active': num === modelValue}]"
            @click="() => goToNum(num)"
        >
            <span>{{ num }}</span>
        </div>
        <div
            class="btn-pagination btn-pagination-icon"
            @click="next"
        >
            <span>›</span>
        </div>
        <div
            class="btn-pagination btn-pagination-icon"
            @click="last"
        >
            <span>»</span>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'b-pagination',
    props: {
        modelValue: { type: Number, default: () => 1 },
        totalRows: { type: Number, required: true },
        perPage: { type: Number, default: () => 25 },
    },
    emits: ['update:modelValue'],
    setup(props, context) {
        function next() {
            if (props.modelValue < numberOfPages.value) {
                context.emit('update:modelValue', props.modelValue + 1);
            }
        }

        function previous() {
            if (props.modelValue > 1) {
                context.emit('update:modelValue', props.modelValue - 1);
            }
        }

        function first() {
            context.emit('update:modelValue', 1);
        }

        function last() {
            context.emit('update:modelValue', numberOfPages.value);
        }

        function goToNum(num: number) {
            context.emit('update:modelValue', num);
        }

        const numberOfPages = computed((): number => {
            const value = Math.ceil(props.totalRows / props.perPage);
            if (value) return value;
            return 1;
        });

        return {
            numberOfPages,
            goToNum,
            next,
            previous,
            last,
            first,
        };
    },
});
</script>

<style scoped lang="scss">

.pagination {
    display: flex;
}

.btn-pagination {
    height: 34px;
    display: flex;
    width: 34px;
    border: 1px solid #dee2e6;
    cursor: pointer;
    margin: auto -1px auto 0;

    span {
        margin: auto;
    }
}

.btn-pagination:hover {
    background: #f1f1f1;
}

.btn-pagination-icon {
    font-size: 18px;
}

.btn-pagination-active {
    background: #f0f0f0;
}

</style>
