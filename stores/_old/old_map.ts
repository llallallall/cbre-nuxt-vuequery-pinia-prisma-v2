//@ts-nocheck
import { defineStore } from 'pinia'
import { MapDefaultOptions } from '~/context/data'
import { useDataStore } from './data'
export const useMapStore = defineStore('map', {
        state: () => ({
                //index
                showMiniMap: true,
                keepStateMiniMap: true,

                //data
                filterMapPins: false,
                filtered: '',
                preserveAsset: {},
                searchedMarkers: [] as Coordinate[],
                searchedMarkersChanged: Date.now(),

                //map
                mapLanguage: null as any,
                mapStyleOptions: MapDefaultOptions,

                //pin
                flyTo: false,
                pinCoordinate: {
                        latitude: 0,
                        longitude: 0,
                        zoom: 18,
                        speed: 1,
                        curve: 1
                },

                //search
                kakaoAddress: [],
                kakaoKeyword: [],
                googleGeocoder: []



        }),
        getters: {

        },

        actions: {
                setDisplayKeptAsset() {
                        const dataStore = useDataStore()
                        dataStore.filteredAssets

                },

                setPinCoordinate(lng: number, lat: number) {
                        this.pinCoordinate.longitude = lng
                        this.pinCoordinate.latitude = lat
                        this.flyTo = true
                },

                //@ts-nocheck
                setSearchedMarkers(lng: number, lat: number) {
                        //console.log('setSearchedMarkers(lng: number, lat: number) {')
                        let coordinate = { 'longitude': lng, 'latitude': lat };

                        if (this.searchedMarkers.find((el: Coordinate) => el.latitude == coordinate.latitude && el.longitude == coordinate.longitude)) {

                                let idx = this.searchedMarkers.findIndex((el: { longitude: number, latitude: number }) => el.latitude == coordinate.latitude && el.longitude == coordinate.longitude)
                                //console.log(idx)
                                this.searchedMarkers.splice(idx, 1);
                                //console.log(this.searchedMarkers)
                        } else {
                                //@ts-ignore
                                this.searchedMarkers.push(coordinate)
                        }

                        //console.log(this.searchedMarkers)
                        this.searchedMarkersChanged = Date.now()
                }
        },
})


type Coordinate = { longitude: number, latitude: number }