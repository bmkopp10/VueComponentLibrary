import { reactive, Ref, ref } from 'vue';

export type ConfirmDialogProps = {
    title: string;
    message: string;
    okButton?: string;
    cancelButton?: string;
    vHtml?: boolean;
};

export interface ConfirmDialogData extends ConfirmDialogProps {
    okButton: string;
    cancelButton: string;
    vHtml: boolean;
}

export type UseDialogBox = {
    confirmModal: Ref<null | HTMLElement>;
    confirm: (props: ConfirmDialogProps) => Promise<boolean>;
};

// These are methods from the Vue component that we want exposed and are only used in this composable
interface ConfirmDialogBox extends HTMLElement {
    show: (props: ConfirmDialogProps) => Promise<boolean>
}

const confirmModal = ref<null | ConfirmDialogBox>(null);

export default function useDialogBox(): UseDialogBox {
    const state = reactive<ConfirmDialogData>({
        title: '',
        message: '',
        okButton: 'Ok',
        cancelButton: 'Cancel',
        vHtml: false,
    });

    async function confirm(props: ConfirmDialogProps): Promise<boolean> {
        state.message = props.message;
        state.title = props.title;
        if (props.okButton) state.okButton = props.okButton;
        if (props.cancelButton) state.cancelButton = props.cancelButton;
        if (props.vHtml) state.vHtml = props.vHtml;
        if (confirmModal.value) {
            return confirmModal.value?.show(state);
        }
        throw new Error('Unable to find dialog box in DOM');
    }

    return {
        confirmModal,
        confirm,
    };
}
