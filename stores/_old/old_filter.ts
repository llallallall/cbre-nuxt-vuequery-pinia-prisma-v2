import { defineStore } from 'pinia'


export const useFilterStore = defineStore('filter', {
        state: () => ({
                searchKeyword: '',
                filterTransactionType: '',
                filterSectorTypes: [] as string[],
                filterSubSectorTypes: [] as string[],

                moreFilters: {
                        gfa: 0,
                        gfaType: true,
                        nfa: 0,
                        nfaType: true,
                        siteArea: 0,
                        siteAreaType: true,

                        built: 0,
                        reno: 0,
                        sales: 0,
                        leases: 0,

                        buildings: 0,
                        basement: 0,
                        upperFloor: 0,
                        elevator: 0,
                        parking: 0,


                        iod: 0,
                        gdm: 0,
                        noc: 0,
                        effRatio: 0,
                },



        }),
        getters: {

        },

        actions: {
                reset(name: string) {
                        if (name === 'built') {
                                this.moreFilters.built = 0
                        }

                        if (name === 'reno') {
                                this.moreFilters.reno = 0
                        }

                        if (name === 'sales') {
                                this.moreFilters.sales = 0
                        }

                        if (name === 'leases') {
                                this.moreFilters.leases = 0
                        }


                }

        },
})
