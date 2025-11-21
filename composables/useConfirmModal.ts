// /composables/useConfirmModal.ts

import { useModal } from 'vue-final-modal';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

export interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export function useConfirmModal() {

    const show = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {

            const { open, close } = useModal({
                component: ConfirmModal,
                attrs: {
                    // Props 전달
                    title: options.title || 'Confirm',
                    message: options.message,
                    confirmText: options.confirmText || 'Confirm',
                    cancelText: options.cancelText || 'Cancel',

                    // 이벤트 핸들러
                    onConfirm() {
                        // 확인 시: true 반환 후 닫기
                        resolve(true);
                        close();
                    },
                    onCancel() {
                        // 취소 버튼 시: false 반환 후 닫기
                        resolve(false);
                        close();
                    },
                    onClosed() {
                        // 💡 [수정] 이제 ConfirmModal에 closed 이벤트가 정의되어 타입 에러가 사라집니다.
                        // 모달이 (배경 클릭 등으로) 완전히 닫혔을 때 안전하게 false 반환
                        // (이미 resolve된 경우 Promise는 무시하므로 안전함)
                        resolve(false);
                    }
                },
            });

            open();
        });
    };

    return {
        show
    };
}