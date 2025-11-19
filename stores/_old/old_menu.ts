import { defineStore } from 'pinia'
export const useMenuStore = defineStore('menu', {
        state: () => ({
                //index
                isFabOpen: false,
                showInfoModal: false,

                //navbar
                isMenuOverlay: false,
                isSearchModalOverlay: false,
                isLogoutOverlay: false,

                //list
                isGrid: false,
                isHidden: false,

                //detail
                isDetailModalOpened: false,
                detailMapRef: [] as any[],
                detailFloorPlanRef: [] as any[],
                googleMapCenter: { lat: 37.559247, lng: 126.614502 },

                //master data
                sector: [] as any[],
                subsector: [] as any[],
                temperature: [] as any[],
        }),
        getters: {},

        actions: {
                async getSector() {
                        try {
                                let res = await useFetch(
                                        '/api/data/code?record=sector',
                                        { method: 'GET' }
                                )
                                this.sector = res.data.value as any
                        } catch (error) {
                                console.log(error)

                                return error
                        }
                },
                async getSubSector() {
                        try {
                                let res = await useFetch(
                                        '/api/data/code?record=subsector',
                                        { method: 'GET' }
                                )
                                this.subsector = res.data.value as any
                                // console.log(this.subsector)
                        } catch (error) {
                                console.log(error)

                                return error
                        }
                },
                async getTemperatureType() {
                        try {
                                let res = await useFetch(
                                        '/api/data/code?record=temperature',
                                        { method: 'GET' }
                                )
                                this.temperature = res.data.value as any
                                // console.log(this.subsector)
                        } catch (error) {
                                console.log(error)

                                return error
                        }
                },
        },
})