<template>
        <div class="w-full h-full overflow-y-scroll overflow-x-hidden mt-1 mb-5">
                <div v-for="(item, index) in kakaoAddress" :key="index" v-if="kakaoAddress.length > 0">
                        <NavWebSearchResultAddress :item="item" />
                </div>

                <div v-for="(item, index) in kakaoKeyword" :key="index" v-if="kakaoKeyword.length > 0">
                        <NavWebSearchResultKeyword :item="item" />
                </div>

                <div v-for="(item, index) in googleGeocoder" :key="index" v-if="googleGeocoder.length > 0">
                        <NavWebSearchResultGeocoder :item="item" />
                </div>

        </div>
</template>

<script setup >
import { storeToRefs } from "pinia";
import { useMapStore } from '~/stores/map';
const { kakaoAddress, kakaoKeyword, googleGeocoder } = storeToRefs(useMapStore());

import googleMapsApi from '@/composables/useGoogleMapsApi';
onBeforeMount(async () => {
        await googleMapsApi();
        // new google.maps.places.Autocomplete(addressInput.value);
})



const searchResult = async (keyword) => {
        //alert(value)
        kakaoAddress.value = [];
        kakaoKeyword.value = [];
        googleGeocoder.value = [];
        // 01. kakao address
        try {

                const { data, error, status } = await useFetch(`/local/search/address.json`, {
                        mehtod: 'GET',
                        baseURL: 'https://dapi.kakao.com/v2',
                        headers: {
                                'Authorization': 'KakaoAK 657b90ae82b373e3599ebf8b8a7bde85',
                        },
                        params: {
                                'analyze_type': 'similar',
                                'page': 1,
                                'size': 30,
                                'query': keyword,
                        },
                })
                if (status.value === 'success' && data.value.documents.length > 0) {
                        //console.log(data.value.documents.length)
                        let resp = data.value.documents

                        resp.forEach((item) => {
                                let jsonData = {}
                                jsonData.name = item.address_name
                                jsonData.type = item.address_type
                                jsonData.province = item.address.region_1depth_name
                                jsonData.city = item.address.region_2depth_name
                                jsonData.street = item.address.region_3depth_name
                                jsonData.longitude = item.x
                                jsonData.latitude = item.y

                                kakaoAddress.value.push(jsonData)
                        })

                } else {
                        console.log('kakao local address callback : ' + data.value.documents.length + ', ' + error.value)
                }


        } catch (error) {
                console.log(error)

        }

        // 02. kakao keyword
        try {
                const { data, error, status } = await useFetch(`/local/search/keyword.json`, {
                        mehtod: 'GET',
                        baseURL: 'https://dapi.kakao.com/v2',
                        headers: {
                                'Authorization': 'KakaoAK 657b90ae82b373e3599ebf8b8a7bde85',
                        },
                        params: {
                                'page': 1,
                                'query': keyword,
                        },
                })

                if (status.value === 'success' && data.value.documents.length > 0) {
                        //console.log(data.value.documents.length)

                        let resp = data.value.documents
                        resp.forEach((item) => {
                                let jsonData = {}
                                jsonData.name = item.place_name
                                jsonData.type = 'KEYWORD'
                                jsonData.category = item.category_name
                                jsonData.place_name = item.place_name
                                jsonData.address = item.address_name
                                jsonData.place_url = item.place_url
                                jsonData.road_address = item.road_address_name
                                let addressArray = item.address_name.split(' ')

                                jsonData.province = addressArray[0]
                                jsonData.city = addressArray[1]
                                jsonData.street = addressArray[3]
                                jsonData.longitude = item.x
                                jsonData.latitude = item.y

                                kakaoKeyword.value.push(jsonData)
                                //console.log(jsonData)
                        })
                } else {
                        console.log('kakao local keyword callback : ' + data.value.documents.length + ', ' + error.value)
                }



        } catch (error) {
                console.log(error)

        }


        // 03. google geocoder 
        try {

                const geocoder = new google.maps.Geocoder();
                geocoder.geocode(
                        { address: keyword },
                        (results, status) => {

                                if (status == "OK" && results.length > 0) {

                                        results.forEach((item) => {
                                                let jsonData = {}
                                                jsonData.name = item.formatted_address
                                                jsonData.type = 'Google'
                                                jsonData.category = item.types[item.types.length - 1]
                                                jsonData.address = item.formatted_address
                                                let addressArray = item.address_components
                                                addressArray.forEach((list, i) => {
                                                        list.types.forEach((item, j) => {
                                                                // console.log(item + ' ' + index)
                                                                if (item == 'administrative_area_level_1') {
                                                                        jsonData.province = addressArray[i].long_name
                                                                } else if (item == 'locality') {
                                                                        jsonData.city = addressArray[i].long_name
                                                                } else if (item == 'sublocality_level_2') {
                                                                        jsonData.street = addressArray[i].long_name
                                                                }
                                                        })

                                                })

                                                let viewport = item.geometry.viewport
                                                let viewportKeys = []
                                                viewportKeys = Object.getOwnPropertyNames(viewport);
                                                let latlon = []
                                                for (let i = 0; i < viewportKeys.length; i++) {
                                                        latlon.push(viewport[viewportKeys[i]].lo.toString())
                                                }

                                                let longitude = Math.max(...latlon);  // 경도 127
                                                let latitude = Math.min(...latlon);  // 위도 37

                                                jsonData.longitude = longitude;
                                                jsonData.latitude = latitude;

                                                googleGeocoder.value.push(jsonData)
                                        })


                                } else {
                                        console.log('google geocoder callback : ' + status)
                                }
                        }
                );


        } catch (error) {
                console.log(error)
        }
        // console.log(kakaoAddress.value)
        // console.log(kakaoKeyword.value)
        // console.log(googleGeocoder.value)


}




defineExpose({
        searchResult
})


</script>

<style scoped></style>