<template>
    <div class="progress-container">
        <span v-if="messageString && percentVal <= 100">{{ messageString }}</span>
        <span v-else-if="overflowMessageString && percentVal > 100">{{ overflowMessageString }}</span>
        <div class="progress">
            <div
                :class="['progress-bar', {'overflow': percentVal > 100 }]"
                role="progressbar"
                :style="{width: percentString}"
                :aria-valuenow="percentString"
                aria-valuemin="0"
                aria-valuemax="100"
            />
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed, defineComponent, PropType, unref,
} from 'vue';

export default defineComponent({
    name: 'b-progress-bar',
    props: {
        percent: {
            type: Object as PropType<number>,
            required: true,
        },
        overflowMessage: {
            type: Object as PropType<string>,
        },
        message: {
            type: Object as PropType<string>,
        },
    },
    setup(props) {
        const percentString = computed((): string => {
            const val = unref(props.percent);
            return `${val.toFixed(0)}%`;
        });

        const percentVal = computed((): number => unref(props.percent));

        const messageString = computed((): string => {
            const val = unref(props.message);
            return `${val}`;
        });

        const overflowMessageString = computed((): string => {
            const val = unref(props.overflowMessage);
            return `${val}`;
        });

        return {
            percentString,
            messageString,
            overflowMessageString,
            percentVal,
        };
    },
});

</script>

<style lang="scss" scoped>

.progress-container {
    width: 90%;
}

.progress {
    height: 10px;
    margin-bottom: 5px;
    margin-top: -2px;
}

.progress-bar {
    background: var(--color-primary);
    color: white;
}

.overflow {
    background: red;
}
</style>
