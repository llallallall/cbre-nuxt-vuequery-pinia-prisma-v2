// stores\app.ts

import { defineStore } from 'pinia'

export interface AppState {
  isLoading: boolean;
  isPdfModalOpen: boolean;
  pdfModalUrl: string;
}

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    isPdfModalOpen: false,
    pdfModalUrl: ''
  }),
  actions: {
    setLoading(status: boolean) {
      this.isLoading = status
    },

    setPdfModalOpen(url: string) {
      this.isPdfModalOpen = true
      this.pdfModalUrl = url;
    },

    setPdfModalClose() {
      this.isPdfModalOpen = false
      this.pdfModalUrl = '';
    },


  },
})