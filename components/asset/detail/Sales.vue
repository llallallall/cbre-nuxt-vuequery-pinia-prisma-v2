<template>
        <Disclosure>
                <DisclosureButton class="py-2 font-financier text-2xl text-primary w-full ">

                        <div class="flex justify-between gap-3 w-full">
                                <div class="w-1/2 flex justify-start">Sales Information</div>

                                <div class="w-1/2 flex justify-end">
                                        <div v-if="info && info?.total > 0" class="bg-primary/10 hover:bg-primary/25 
                                        text-primary rounded-full
                                        px-4 py-1 min-w-[100px]
                                        flex justify-center items-center ">
                                                {{ info.total }}
                                        </div>
                                </div>
                        </div>

                </DisclosureButton>
                <DisclosurePanel class="font-calibreLight text-lg text-primary">
                        <table class="table-auto w-full">
                                <thead>
                                        <tr class="font-calibre">
                                                <th>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                                                        </svg>

                                                </th>
                                                <th>Seller
                                                </th>
                                                <th>Buyer
                                                </th>
                                                <th>YR-Q
                                                </th>
                                                <th>Type
                                                </th>
                                                <th>GFA
                                                </th>
                                                <th>NFA</th>
                                                <th>Price<sub>(KRW)</sub>
                                                </th>
                                                <th>Price/GFA
                                                </th>
                                                <th>Price/NFA
                                                </th>
                                                <th>ECR
                                                </th>
                                                <th>IRR
                                                </th>
                                                <th>Remarks
                                                </th>
                                        </tr>
                                </thead>
                                <tbody>
                                        <tr v-for="(item, idx) in info?.transactions" class="font-calibreLight">
                                                <td><input :id="'t' + idx" type="checkbox" class="ml-[4px] border border-primary text-primary rounded-[5px]
                                                                focus:outline-none focus:ring-offset-0 focus:ring-0
                                                                checked:outline-none checked:ring-offset-0 checked:ring-0
                                                                hover:outline-none hover:ring-offset-0 hover:ring-0
                                                                " />
                                                </td>
                                                <td>{{ item.seller }}</td>
                                                <td>{{ item.buyer }}</td>
                                                <td>{{ item.transactionYear + '-' + item.transactionQuarter }}</td>
                                                <td>{{ item.transactionType }}</td>
                                                <td>{{ numberFormat(item.gfaSqm,
                                                        2)
                                                }} m<sup>2</sup></td>
                                                <td>{{
                                                        numberFormat(item.nfaSqm,
                                                                2)
                                                }}
                                                        m<sup>2</sup></td>
                                                <td>{{
                                                        numberFormat(item.priceKrw,
                                                                0)
                                                }} ₩</td>
                                                <td>{{
                                                        numberFormat(item.pricePerGfa,
                                                                0)
                                                }} ₩/m<sup>2</sup>
                                                        m<sup>2</sup></td>
                                                <td>{{
                                                        numberFormat(item.pricePerNfa,
                                                                0)
                                                }} ₩/m<sup>2</sup></td>
                                                <td>{{
                                                        numberFormat(item.estCapRate,
                                                                2)
                                                }} %</td>
                                                <td>{{
                                                        numberFormat(item.estDiscountRate,
                                                                2)
                                                }} %</td>
                                                <td>{{ item.remarks }}</td>
                                        </tr>

                                </tbody>
                        </table>
                </DisclosurePanel>
        </Disclosure>
</template>

<script setup lang="ts">
const { info } = defineProps({
        info: {
                required: false,
                type: Object
        }
})


import {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
} from '@headlessui/vue'
</script>

