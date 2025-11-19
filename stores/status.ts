// /store/status.ts

// 전역 상태 / 피드백: API 호출 isLoading, 전역 error 메시지, Confirm Modal, PDF / Image Viewer Modal 상태.

import { defineStore } from 'pinia';

// ----------------------------------------------------------------------
// 1. 상태 타입 정의 (Status State Type)
// ----------------------------------------------------------------------

/**
 * @description 확인/삭제 모달의 응답을 처리하기 위한 콜백 함수 타입 정의
 */
export type ConfirmCallback = (confirmed: boolean) => void;

/**
 * @description 전역 로딩, 에러, 모달 상태를 관리하는 인터페이스
 */
interface StatusState {
        // 1. 전역 API 로딩 상태 (DB 작업 시 전체 화면 Loading Modal에 사용)
        isGlobalLoading: boolean;
        // API 호출 실패 시 에러 메시지
        globalError: string | null;
        // 로딩 또는 에러를 발생시킨 액션의 이름 (디버깅 용이성)
        lastAction: string | null;

        // 2. 파일 뷰어 모달 상태 (이미지/PDF 클릭 시 전체 화면 Modal)
        isViewerModalOpen: boolean;
        viewerModalUrl: string | null;
        viewerModalType: 'image' | 'pdf' | null; // 파일 종류 구분

        // 3. Confirm Modal 상태 (삭제, 중요 변경 등 시 사용)
        isConfirmModalOpen: boolean;
        confirmModalTitle: string;    // Confirm 모달 제목
        confirmModalMessage: string;  // Confirm 모달 메시지
        // Confirm 응답을 처리할 콜백 함수 (Promise 또는 async/await으로 대체 가능)
        confirmCallback: ConfirmCallback | null;
}

// ----------------------------------------------------------------------
// 2. 초기 상태 정의 (Initial State)
// ----------------------------------------------------------------------

const getInitialState = (): StatusState => ({
        isGlobalLoading: false,
        globalError: null,
        lastAction: null,

        isViewerModalOpen: false,
        viewerModalUrl: null,
        viewerModalType: null,

        isConfirmModalOpen: false,
        confirmModalTitle: 'Confirm Action', // 기본 제목
        confirmModalMessage: '',
        confirmCallback: null,
});

// ----------------------------------------------------------------------
// 3. Pinia Store 정의 (useStatusStore)
// ----------------------------------------------------------------------

export const useStatusStore = defineStore('status', {
        state: getInitialState,

        actions: {
                // ------------------- A. 로딩/에러 액션 -------------------

                /**
                 * @description 전역 로딩 상태를 설정합니다.
                 * @param status - true면 로딩 시작, false면 로딩 종료
                 * @param actionName - 로딩을 발생시킨 액션의 이름
                 */
                setGlobalLoading(status: boolean, actionName: string | null = null) {
                        this.isGlobalLoading = status;
                        this.lastAction = actionName;
                        // 로딩 시작 시 에러 상태 초기화
                        if (status) {
                                this.globalError = null;
                        }
                },

                /**
                 * @description 전역 에러 메시지를 설정하고 로딩 상태를 해제합니다.
                 * @param message - 에러 메시지 문자열
                 * @param actionName - 에러를 발생시킨 액션의 이름
                 */
                setGlobalError(message: string | null, actionName: string | null = null) {
                        this.globalError = message;
                        this.lastAction = actionName;
                        // 에러 발생 시 로딩 상태 해제
                        this.isGlobalLoading = false;
                },

                // ------------------- B. 파일 뷰어 모달 액션 -------------------

                /**
                 * @description 파일 뷰어 모달을 엽니다. (이미지/PDF)
                 * @param url - 파일 URL
                 * @param type - 파일 타입 ('image' 또는 'pdf')
                 */
                openViewerModal(url: string, type: 'image' | 'pdf') {
                        this.viewerModalUrl = url;
                        this.viewerModalType = type;
                        this.isViewerModalOpen = true;
                },

                /**
                 * @description 파일 뷰어 모달을 닫습니다.
                 */
                closeViewerModal() {
                        this.isViewerModalOpen = false;
                        this.viewerModalUrl = null;
                        this.viewerModalType = null;
                },

                // ------------------- C. Confirm 모달 액션 -------------------

                /**
                 * @description Confirm 모달을 엽니다.
                 * @param message - 모달에 표시될 메시지
                 * @param callback - 사용자의 확인/취소 결과에 따라 호출될 콜백 함수
                 * @param title - 모달 제목 (선택 사항, 기본값 'Confirm Action')
                 */
                openConfirmModal(message: string, callback: (confirmed: boolean) => void, title: string = 'Confirm Action') {
                        console.log('Confirm 모달 열기 요청:', message, title);
                        this.confirmModalTitle = title;
                        this.confirmModalMessage = message;
                        this.confirmCallback = callback;
                        this.isConfirmModalOpen = true;
                },

                /**
                 * @description Confirm 모달을 닫고 콜백을 호출합니다. (컴포넌트에서 사용)
                 * @param confirmed - 사용자가 확인(true)을 눌렀는지 취소(false)를 눌렀는지
                 */
                closeConfirmModal(confirmed: boolean) {
                        console.log('Confirm 모달 닫기:', confirmed ? '확인됨' : '취소됨');
                        if (this.confirmCallback) {
                                this.confirmCallback(confirmed);
                        }
                        this.isConfirmModalOpen = false;
                        this.confirmModalTitle = 'Confirm Action'; // 상태 초기화
                        this.confirmModalMessage = ''; // 상태 초기화
                        this.confirmCallback = null; // 콜백 함수 초기화
                },

                // ------------------- D. 전체 초기화 -------------------

                /**
                 * @description 모든 전역 상태를 초기값으로 리셋합니다.
                 */
                resetStatus() {
                        Object.assign(this, getInitialState());
                }
        },
});