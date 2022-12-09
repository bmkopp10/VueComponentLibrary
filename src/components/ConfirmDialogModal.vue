<template>
    <b-modal
        v-model="visible"
        centered
        :title="title"
        :ok-button="okButton"
        :cancel-button="cancelButton"
        hide-header-close
        static-backdrop
        @ok="_onOk"
        @cancel="_onCancel"
    >
        <p
            v-if="vHtml"
            v-html="message"
        />
        <p v-else>
            {{ message }}
        </p>
    </b-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BModal from './BModal.vue';
import { ConfirmDialogData } from '../../composables/useDialogBox';

export default defineComponent({
    name: 'confirm-dialog-modal',
    components: { BModal },
    data: () => ({
        visible: false,
        title: '',
        message: '',
        okButton: '',
        cancelButton: '',
        resolvePromise: undefined,
        vHtml: false,
    }),
    beforeMount() {
        document.addEventListener('confirm', this._confirm);
        document.addEventListener('cancel', this._cancel);
    },
    methods: {
        show(data: ConfirmDialogData): Promise<boolean> {
            this.title = data.title;
            this.message = data.message;
            this.okButton = data.okButton;
            this.cancelButton = data.cancelButton;
            this.visible = true;
            this.vHtml = data.vHtml;

            return new Promise((resolve) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.resolvePromise = resolve;
            });
        },
        _confirm() {
            if (this.resolvePromise) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.resolvePromise(true);
            }
        },
        _cancel() {
            if (this.resolvePromise) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.resolvePromise(false);
            }
        },
        _onOk() {
            const event = new CustomEvent('confirm');
            document.dispatchEvent(event);
        },
        _onCancel() {
            const event = new CustomEvent('cancel');
            document.dispatchEvent(event);
        },
    },
});
</script>
