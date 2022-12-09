<template>
    <div class="empty-state-screen">
        <div class="empty-state-content">
            <div
                v-if="icon"
                class="icon-container"
            >
                <faicon :icon="icon" />
            </div>
            <span class="empty-state-title">{{ title }}</span>
            <span class="empty-state-message">{{ message }}</span>
            <b-button
                v-if="button"
                :variant="button.variant"
                :disabled="button.disabled"
                @click="button.onClick"
            >
                {{ button.text }}
            </b-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import BButton from './BButton.vue';
import {Variant} from "@/types";

type ButtonProps = {
    text: string,
    variant?: Variant,
    onClick: () => void,
    disabled: boolean,
}

export type EmptyStateProps = {
    title: string
    message?: string
    icon?: string;
    button?: ButtonProps;
}

export default defineComponent({
    name: 'empty-state',
    components: { BButton },
    props: {
        title: { type: String, required: true },
        message: { type: String, default: undefined },
        icon: { type: String, default: undefined },
        button: { type: Object as PropType<ButtonProps>, default: undefined },
    },
});
</script>

<style scoped lang="scss">
.empty-state-screen {
    height: 100%;
    width: 100%;
    background-color: #f4f4f4;
    display: flex;

    .empty-state-content {
        margin: auto;
        display: flex;
        flex-direction: column;
        width: 360px;

        > * {
            margin: 10px auto;
        }

        .empty-state-title {
            font-size: 20px;
        }

        .empty-state-message {
            color: $gray-600;
        }
    }

    .icon-container {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background-color: $gray-400;
        display: flex;

        svg {
            color: $gray-500;
            font-size: 100px;
            height: 100%;
            text-align: center;
            margin: auto;
        }
    }

}
</style>
