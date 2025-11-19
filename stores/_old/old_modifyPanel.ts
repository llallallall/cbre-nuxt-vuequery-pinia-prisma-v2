// stores/modifyPanel.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';

// 수정 패널에 표시할 섹션의 타입을 정의합니다.
export type ModifySectionType =
  'general' |
  'profitability' |
  'history' |
  'location' |
  'sizes' | // scale 모델에 해당
  'accessibility' |
  'facility' |
  'parking' |
  'floor' |
  'floorplan' |
  'sale' |
  'lease' |
  'photo' | // files 파일 목록 (photo, brochure, floor plan)
  'brochure' |
  null;

export const useModifyPanelStore = defineStore('modifyPanel', () => {

  const debug = ref(true);
  const shrinkPreview = ref(false);
  const growPreview = ref(false);

  // 패널이 열려 있는지 여부
  const isOpen = ref(false);
  // 현재 패널에 표시할 수정 섹션
  const currentSection = ref<ModifySectionType>(null);

  /**
   * 수정 패널을 열고, 수정할 섹션을 설정합니다.
   * @param section - 수정할 자산 정보 섹션 (예: 'general')
   */
  function openPanel(section: ModifySectionType) {
    currentSection.value = section;
    isOpen.value = true;
    shrinkPreview.value = true;
  }

  /**
   * 수정 패널을 닫습니다.
   */
  function closePanel() {
    isOpen.value = false;
    shrinkPreview.value = false;
    // currentSection.value = null; // 닫힐 때 콘텐츠를 유지하려면 주석 처리
  }

  return { isOpen, currentSection, openPanel, closePanel, debug, shrinkPreview, growPreview };
});