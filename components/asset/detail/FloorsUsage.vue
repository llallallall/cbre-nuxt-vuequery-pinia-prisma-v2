<template>
        <Disclosure>
                <DisclosureButton class="py-2 font-financier text-2xl text-primary w-full ">

                        <div class="flex justify-between gap-3 w-full mb-5">
                                <div class="w-1/2 flex justify-start">Floors Information</div>

                                <div class="w-1/2 flex justify-end">
                                        <div  class="bg-primary/10 hover:bg-primary/25 
                                        text-primary rounded-full
                                        px-4 py-1 min-w-[100px]
                                        flex justify-center items-center ">
                                                {{ info ? info.length : 0}}
                                        </div>
                                </div>
                        </div>

                </DisclosureButton>
                <DisclosurePanel class="font-calibreLight text-lg text-primary w-full overflow-x-scroll">
                        <table class="table-auto w-full border-collapse border border-gray-200 mb-5">
                                <thead>
                                        <tr class="font-calibre border  bg-gray-200/50">

                                                <th v-for="item in floorHeaders" :key="item.value" class="whitespace-nowrap  px-2 
                                                        text-sm
                                                        text-center 
                                                        py-2
                                                        border border-white/75">
                                                        {{
                                                                item.text }}</th>
                                        </tr>
                                </thead>
                                <tbody>

                                        <!-- <tr v-for="(data, index ) in   JSON.parse(JSON.stringify(datas))  " :key="index"
                                                class="font-calibreLight ">

                                                <td v-for="(key, idx) in   (headerKeys as string[])  " :key="key + index"
                                                        :rowspan="data[key].rowspan ? data[key].rowspan : null"
                                                        :cowspan="data[key].colspan ? data[key].colspan : null"
                                                        :class="[headerClasses[idx], JSON.parse(JSON.stringify(datas))[index - 1] ? (JSON.parse(JSON.stringify(datas))[index - 1][key]?.rowspan ? 'hidden' : '') : null]"
                                                        class="whitespace-pre 
                                                        text-sm py-2
                                                        px-2 border border-gray-200">

                                                        {{ data[key].value }}
                                                </td>


                                        </tr> -->


                                        <!-- :rowspan="data[key].rowspan ? data[key].rowspan : null"
                                                        :cowspan="data[key].colspan ? data[key].colspan : null"
                                                        :class="[floorHeaderClasses[idx], JSON.parse(JSON.stringify(datas))[index - 1] ? (JSON.parse(JSON.stringify(datas))[index - 1][key]?.rowspan ? 'hidden' : '') : null]" -->

                                        <tr  v-for="(data, index ) in info  " :key="index"
                                                class="font-calibreLight"
                                                
                                                >
                                                <td v-for="(key, idx) in (floorHeaderKeys as string[])  " :key="key + index"
                                                        class="whitespace-pre 
                                                        text-sm py-2
                                                        px-2 border border-gray-200"
                                                        :class="floorHeaderClasses[idx]"
                                                        >
                                                        {{ data[key] }}
                                                </td>
                                        
                                        </tr>

                                </tbody>
                        </table>
                </DisclosurePanel>
        </Disclosure>

         

</template>

<script setup lang="ts">
import {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
} from '@headlessui/vue'
// import { JsonArray } from '@prisma/client/runtime/library';
// import { storeToRefs } from "pinia";
import { usePropertyStore } from '~/stores/property';

const propertyStore = usePropertyStore()
const { info } = defineProps({
        info: {
                required: false,
                type: Object
        }
        
})


const floorHeaders = [
        {
                text: 'Type',
                value: 'type',
                class: 'text-right'
        }
        ,
        {
                text: 'Floor',
                value: 'num',
                class: 'text-right'
        }
        ,
          {
                text: 'Usage',
                value: 'usage',
                class: 'text-center'
        },
        {
                text: 'Tenant',
                value: 'tenant',
                class: 'text-center'
        },
        {
                text: 'Section',
                value: 'section',
                class: 'text-center'
        },
        {
                text: 'SecUsage',
                value: 'sectionUsage',
                class: 'text-center'
        },
        {
                text: 'Building Area',
                value: 'buildingArea',
                class: 'text-right'
        },
        {
                text: 'Rental Area',
                value: 'rentalArea',
                class: 'text-right'
        },
        {
                text: 'Contract Start',
                value: 'contractStartDate',
                class: ''
        },
        {
                text: 'Contract Expire',
                value: 'contractExpiryDate',
                class: ''
        },
        {
                text: 'Deposit',
                value: 'deposit',
                class: 'text-right'
        },
        {
                text: 'Rent/mth',
                value: 'monthlyRent',
                class: 'text-right'
        },
        {
                text: 'Mgmt Fee/mth',
                value: 'monthlyManagementFee',
                class: 'text-right'
        },
        {
                text: 'Conditions Deposit Raise',
                value: 'raiseConditionsDeposit',
                class: ''
        },
        {
                text: 'Conditions Rent Raise',
                value: 'raiseConditionsRent',
                class: ''
        },
        {
                text: 'Conditions Mgmt Fee Raise',
                value: 'raiseConditionsMgmtFee',
                class: ''
        },


        {
                text: 'Rent Free',
                value: 'rentFree',
                class: ''
        },
        {
                text: 'Fit Out',
                value: 'fitOut',
                class: ''
        },
        {
                text: 'Ceiling Height(m)',
                value: 'ceilingHeight',
                class: 'text-right'
        }
        ,
        {
                text: 'Floor Load(ton/㎡)',
                value: 'floorLoad',
                class: 'text-right'
        }
        ,
        {
                text: 'Truck Berths(units)',
                value: 'truckBerths',
                class: 'text-right'
        }

]

const floorHeaderKeys = computed(() => { return floorHeaders.map((header => header.value)) })
const floorHeaderClasses = computed(() => { return floorHeaders.map((header => header.class)) })
 

// const datas: Object[] = [
//         {
//                 floor: { value: '4F' },
//                 usage: {
//                         value: '상온'
//                 },
//                 tenant: {
//                         value: '롯데글로벌로지스'
//                 },
//                 section: {
//                         value: '4F'
//                 },
//                 sectionUsage: {
//                         value: '상온⑶'
//                 },
//                 buildingArea: {
//                         value: '7190.98㎡(2175.27py)'
//                 },
//                 rentalArea: {
//                         value: '7303.47㎡(2209.3py)'
//                 },
//                 contractStartDate: {
//                         value: '2022.6.1'
//                 },
//                 contractExpiryDate: {
//                         value: '2029.5.31'
//                 },
//                 deposit: {
//                         value: '331,395,000 ₩'
//                 },
//                 monthlyRent: {
//                         value: '64,069,700 ₩(29,000 ₩/py)'
//                 },
//                 monthlyManagementFee: {
//                         value: '4,860,460 ₩(2,200 ₩/py)'
//                 },
//                 raiseConditionsDeposit: {
//                         value: '-',
//                 },
//                 raiseConditionsRent: {
//                         value: '- 매년 1.5% 인상\r\n  (2022-06-01~2025-05 - 31) \r\n- 매년 협의하여 결정\r\n  (2025- 06-01~2029-05 - 31)',
//                         rowspan: 2,
//                 },
//                 raiseConditionsMgmtFee: {
//                         value: '- 매년 1.5% 인상\r\n  (2022-06-01~2025-05 - 31) \r\n- 매년 협의하여 결정\r\n  (2025- 06-01~2029-05 - 31)',
//                         rowspan: 2,
//                 },
//                 rentFree: {
//                         value: '총 2개월\r\n(23년 7월, 24년 7월)',
//                         rowspan: 2,
//                 },
//                 fitOut: {
//                         value: '00월00일~00월00일'
//                 },
//                 ceilingHeight: {
//                         value: '15.5 m'
//                 },
//                 floorLoad: {
//                         value: '2.0 ton/㎡'
//                 },
//                 simultaneousBerthing: {
//                         value: '16 units'
//                 },
//         },
//         {
//                 floor: {
//                         value: '3F'
//                 },
//                 usage: {
//                         value: '사무실'
//                 },
//                 tenant: {
//                         value: '롯데글로벌로지스'
//                 },
//                 section: {
//                         value: '3F'
//                 },
//                 sectionUsage: {
//                         value: '사무실'
//                 },
//                 buildingArea: {
//                         value: '831.58(251.55)'
//                 },
//                 rentalArea: {
//                         value: '844.59(255.49)'
//                 },
//                 contractStartDate: {
//                         value: '2022.6.1'
//                 },
//                 contractExpiryDate: {
//                         value: '2029.5.31'
//                 },
//                 deposit: {
//                         value: '38323500'
//                 },
//                 monthlyRent: {
//                         value: '7,409,210(29,000)'
//                 },
//                 monthlyManagementFee: {
//                         value: '562,078(2,200)'
//                 },

//                 raiseConditionsDeposit: {
//                         value: '-',
//                 },
//                 raiseConditionsRent: {
//                         value: '- 매년 1.5% 인상\r\n  (2022-06-01~2025-05 - 31) \r\n- 매년 협의하여 결정\r\n  (2025- 06-01~2029-05 - 31)',
//                 },
//                 raiseConditionsMgmtFee: {
//                         value: '- 매년 1.5% 인상\r\n  (2022-06-01~2025-05 - 31) \r\n- 매년 협의하여 결정\r\n  (2025- 06-01~2029-05 - 31)',
//                 },
//                 rentFree: {
//                         value: '총 2개월\r\n(23년 7월, 24년 7월)',
//                 },
//                 fitOut: {
//                         value: '00월00일~00월00일'
//                 },
//                 ceilingHeight: {
//                         value: '4.6 m'
//                 },
//                 floorLoad: {
//                         value: '0.35 ton ~ 0.6 ton'
//                 },
//                 simultaneousBerthing: {
//                         value: '-'
//                 },
//         },
//         {
//                 floor: {
//                         value: '2F',
//                         rowspan: 2
//                 },
//                 usage: {
//                         value: '상온',
//                         rowspan: 2
//                 },
//                 tenant: {
//                         value: '롯데글로벌로지스'
//                 },
//                 section: {
//                         value: '2F',
//                         rowspan: 2
//                 },
//                 sectionUsage: {
//                         value: '상온⑶'
//                 },
//                 buildingArea: {
//                         value: '2,667.28(8,817.45)',
//                         rowspan: 2
//                 },
//                 rentalArea: {
//                         value: '1,866.81(6,171.27)'
//                 },
//                 contractStartDate: {
//                         value: '2022.6.1'
//                 },
//                 contractExpiryDate: {
//                         value: '2029.5.31'
//                 },
//                 deposit: {
//                         value: '280021500'
//                 },
//                 monthlyRent: {
//                         value: '54,137,490(29,000)'
//                 },
//                 monthlyManagementFee: {
//                         value: '4,106,982(2,200)'
//                 },
//                 raiseConditionsDeposit: {
//                         value: '-',
//                 },
//                 raiseConditionsRent: {
//                         value: '-',
//                 },
//                 raiseConditionsMgmtFee: {
//                         value: '-',
//                 },
//                 rentFree: {
//                         value: '-',
//                 },
//                 fitOut: {
//                         value: '00월00일~00월00일'
//                 },
//                 ceilingHeight: {
//                         value: '10.4m',
//                         rowspan: 2
//                 },
//                 floorLoad: {
//                         value: '2.0 ton',
//                         rowspan: 2
//                 },
//                 simultaneousBerthing: {
//                         value: '23 대',
//                         rowspan: 2
//                 },
//         },
//         {
//                 floor: {
//                         value: '2F'
//                 },
//                 usage: {
//                         value: '상온'
//                 },
//                 tenant: {
//                         value: '공실'
//                 },
//                 section: {
//                         value: '2F'
//                 },
//                 sectionUsage: {
//                         value: '상온'
//                 },
//                 buildingArea: {
//                         value: '831.58(251.55)'
//                 },
//                 rentalArea: {
//                         value: '2,731.47(826.27)'
//                 },
//                 contractStartDate: {
//                         value: '-'
//                 },
//                 contractExpiryDate: {
//                         value: '-'
//                 },
//                 deposit: {
//                         value: '-'
//                 },
//                 monthlyRent: {
//                         value: '-'
//                 },
//                 monthlyManagementFee: {
//                         value: '-'
//                 },
//                 raiseConditionsDeposit: {
//                         value: '-',
//                 },
//                 raiseConditionsRent: {
//                         value: '-',
//                 },
//                 raiseConditionsMgmtFee: {
//                         value: '-',
//                 },
//                 rentFree: {
//                         value: '-',
//                 },
//                 fitOut: {
//                         value: '00월00일~00월00일'
//                 },
//                 ceilingHeight: {
//                         value: '4.6 m'
//                 },
//                 floorLoad: {
//                         value: '0.35 ton ~ 0.6 ton'
//                 },
//                 simultaneousBerthing: {
//                         value: '-'
//                 },
//         },
//         {
//                 floor: {
//                         value: '1F',

//                 },
//                 usage: {
//                         value: '사무실',
//                 },
//                 tenant: {
//                         value: '롯데글로벌로지스'
//                 },
//                 section: {
//                         value: '1F',
//                 },
//                 sectionUsage: {
//                         value: '사무실'
//                 },
//                 buildingArea: {
//                         value: '483.55(146.27)',
//                 },
//                 rentalArea: {
//                         value: '491.11(148.56)'
//                 },
//                 contractStartDate: {
//                         value: '2022.6.1'
//                 },
//                 contractExpiryDate: {
//                         value: '2025.5.31'
//                 },
//                 deposit: {
//                         value: '21541200'
//                 },
//                 monthlyRent: {
//                         value: '4,308,240(29,000)'
//                 },
//                 monthlyManagementFee: {
//                         value: '326,832(2,200)'
//                 },
//                 raiseConditionsDeposit: {
//                         value: '-',
//                 },
//                 raiseConditionsRent: {
//                         value: '매년 1.5% 인상',
//                         rowspan: 2
//                 },
//                 raiseConditionsMgmtFee: {
//                         value: '매년 1.5% 인상',
//                         rowspan: 2
//                 },
//                 rentFree: {
//                         value: '총 2개월\r\n(23년 7월, 24년 7월)',
//                         rowspan: 2
//                 },
//                 fitOut: {
//                         value: '00월00일~00월00일'
//                 },
//                 ceilingHeight: {
//                         value: '4.6m',

//                 },
//                 floorLoad: {
//                         value: '0.35ton ~ 0.6 ton',

//                 },
//                 simultaneousBerthing: {
//                         value: '-',

//                 },
//         },
//         {
//                 floor: {
//                         value: 'B1F',
//                         rowspan: 2
//                 },
//                 usage: {
//                         value: '저온',
//                         rowspan: 2
//                 },
//                 tenant: {
//                         value: '롯데글로벌로지스'
//                 },
//                 section: {
//                         value: 'B1F',
//                         rowspan: 2
//                 },
//                 sectionUsage: {
//                         value: '저온'
//                 },
//                 buildingArea: {
//                         value: '10,164.75(3,074.84)',
//                         rowspan: 2
//                 },
//                 rentalArea: {
//                         value: '6,633.19(2,006.54)'
//                 },
//                 contractStartDate: {
//                         value: '2022.6.1'
//                 },
//                 contractExpiryDate: {
//                         value: '2025.5.31'
//                 },
//                 deposit: {
//                         value: '591929300'
//                 },
//                 monthlyRent: {
//                         value: '118,385,860(59,000)'
//                 },
//                 monthlyManagementFee: {
//                         value: '4,414,388(2,200)'
//                 },
//                 raiseConditionsDeposit: {
//                         value: '-',
//                 },
//                 raiseConditionsRent: {
//                         value: '매년 1.5% 인상',
//                 },
//                 raiseConditionsMgmtFee: {
//                         value: '매년 1.5% 인상',
//                 },
//                 rentFree: {
//                         value: '총 2개월\r\n(23년 7월, 24년 7월)',
//                 },
//                 fitOut: {
//                         value: '00월00일~00월00일'
//                 },
//                 ceilingHeight: {
//                         value: '10.4m',
//                         rowspan: 2

//                 },
//                 floorLoad: {
//                         value: '2.0 ton',
//                         rowspan: 2

//                 },
//                 simultaneousBerthing: {
//                         value: '22대',
//                         rowspan: 2

//                 },
//         },
//         {
//                 floor: {
//                         value: 'B1F',
//                 },
//                 usage: {
//                         value: '저온',
//                 },
//                 tenant: {
//                         value: '공실'
//                 },
//                 section: {
//                         value: 'B1F',
//                 },
//                 sectionUsage: {
//                         value: '저온'
//                 },
//                 buildingArea: {
//                         value: null,
//                 },
//                 rentalArea: {
//                         value: '3,313.22(1,002.25)'
//                 },
//                 contractStartDate: {
//                         value: '-'
//                 },
//                 contractExpiryDate: {
//                         value: '-'
//                 },
//                 deposit: {
//                         value: '-'
//                 },
//                 monthlyRent: {
//                         value: '-'
//                 },
//                 monthlyManagementFee: {
//                         value: '-'
//                 },
//                 raiseConditionsDeposit: {
//                         value: '-',
//                 },
//                 raiseConditionsRent: {
//                         value: '-',
//                 },
//                 raiseConditionsMgmtFee: {
//                         value: '-',
//                 },
//                 rentFree: {
//                         value: '-',
//                 },
//                 fitOut: {
//                         value: '00월00일~00월00일'
//                 },
//                 ceilingHeight: {
//                         value: '10.4m',
//                 },
//                 floorLoad: {
//                         value: '2.0 ton',
//                 },
//                 simultaneousBerthing: {
//                         value: '22대',
//                 },
//         },

// ]



</script>

