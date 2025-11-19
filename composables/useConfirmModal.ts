// /composables/useConfirmModal.ts

import { useModal } from 'vue-final-modal';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import type { ExtractPropTypes } from 'vue';

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
}

type ConfirmModalProps = ExtractPropTypes<typeof ConfirmModal['__hmrId']>;

/**
 * @description 전역 Confirm Modal을 Promise 형태로 실행하는 Composable입니다.
 * @returns { show: (options: ConfirmOptions) => Promise<boolean> }
 */
export function useConfirmModal() {

    const show = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {

            const { open, close } = useModal({
                component: ConfirmModal,
                attrs: {
                    title: options.title || 'Confirm',
                    message: options.message,
                    confirmText: options.confirmText || 'Confirm',

                    // 모달의 이벤트에 Promise resolve 로직 바인딩
                    onConfirm() {
                        close();
                        resolve(true);
                    },
                    onCancel() {
                        close();
                        resolve(false);
                    },
                },
            });

            open();
        });
    };

    return {
        show
    };
}