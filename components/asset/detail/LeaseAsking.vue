<template>
        <Disclosure>
                <DisclosureButton class="py-2 font-financier text-2xl text-primary w-full">
                        <div class="flex justify-between gap-3 w-full">
                                <div class="w-1/2 flex justify-start">Lease Asking Information</div>

                                <div class="w-1/2 flex justify-end">
                                        <div v-if="info && info?.askingCnt > 0" class="bg-primary/10 hover:bg-primary/25 
                                        text-primary rounded-full
                                        px-4 py-1 min-w-[100px]
                                        flex justify-center items-center">
                                                {{ info.askingCnt }}
                                        </div>
                                </div>
                        </div>
                </DisclosureButton>
                <DisclosurePanel class="font-calibreLight text-lg text-primary w-full overflow-x-scroll pb-5">
                        <div class="w-full h-full">
                                <table class="table-auto w-full whitespace-nowrap pb-10">
                                        <thead>
                                                <tr class="font-calibre ">
                                                        <th>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                        viewBox="0 0 24 24" stroke-width="1.5"
                                                                        stroke="currentColor" class="w-6 h-6">
                                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                                                d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                                                                </svg>

                                                        </th>
                                                        <th class="px-4">Floor
                                                        </th>
                                                        <th class="px-4">Unit
                                                        </th>
                                                        <th class="px-4">Date
                                                        </th>
                                                        <th class="px-4">GFA(Sqm)
                                                        </th>
                                                        <th class="px-4">GFA(Py)
                                                        </th>
                                                        <th class="px-4">NFA(Sqm)</th>
                                                        <th class="px-4">NFA(Py)
                                                        </th>
                                                        <th class="px-4">Eff. Ratio
                                                        </th>
                                                        <th class="px-4">Monthly Rent
                                                        </th>
                                                        <th class="px-4">Monthly CAMF
                                                        </th>
                                                        <th class="px-4">Deposit
                                                        </th>
                                                        <th class="px-4">Rent Mth Py
                                                        </th>
                                                        <th class="px-4">CAMF Mth Py
                                                        </th>
                                                        <th class="px-4">Deposit Py
                                                        </th>
                                                        <th class="px-4">IOD
                                                        </th>
                                                        <th class="px-4">GDM
                                                        </th>
                                                        <th class="px-4">NOC
                                                        </th>
                                                        <th class="px-4">Lease Term Year
                                                        </th>
                                                        <th class="px-4">Rent Free Type
                                                        </th>
                                                        <th class="px-4">Rent Free Mth
                                                        </th>
                                                        <th class="px-4">Effective Noc
                                                        </th>
                                                        <th class="px-4">Fit-Out
                                                        </th>
                                                        <th class="px-4">Amount Krw
                                                        </th>
                                                        <th class="px-4">Amount Nfa Py
                                                        </th>
                                                        <th class="px-4">Total Free Rent Period Mth
                                                        </th>
                                                        <th class="px-4">Total Occupying Period Year
                                                        </th>
                                                        <th class="px-4">Total Free Rent Occupying Year
                                                        </th>
                                                        <th class="px-4">Monthly Cash Support Gfa
                                                        </th>
                                                        <th class="px-4">All In Effective Rent Mth Py
                                                        </th>
                                                        <th class="px-4">All In Noc
                                                        </th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(leaseItem, idx) in info?.leases"
                                                        class="font-calibreLight text-right">
                                                        <td class="text-left"><input :id="'lt' + idx" type="checkbox" class="ml-[4px] border border-primary text-primary rounded-[5px]
                                                                focus:outline-none focus:ring-offset-0 focus:ring-0
                                                                checked:outline-none checked:ring-offset-0 checked:ring-0
                                                                hover:outline-none hover:ring-offset-0 hover:ring-0
                                                                " />
                                                        </td>
                                                        <td class="px-4">{{ leaseItem.askingFloor }}</td>
                                                        <td class="px-4">{{ leaseItem.askingUnit }}</td>
                                                        <td class="px-4">{{ formatDate(leaseItem.askingMoveInDate)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingGfaSqm,
                                                                        2)
                                                        }} m<sup>2</sup></td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingGfaPy,
                                                                        2)
                                                        }} py</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingNfaSqm,
                                                                        2)
                                                        }} m<sup>2</sup></td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingNfaPy,
                                                                        2)
                                                        }} py</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingEffRatio,
                                                                        2)
                                                        }} %</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingMonthlyRent,
                                                                        0)
                                                        }} ₩</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingMonthlyCAMF,
                                                                        0)
                                                        }} ₩</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingDeposit,
                                                                        0)
                                                        }} ₩</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingRentMthPy,
                                                                        2)
                                                        }} ₩</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingCamfMthPy,
                                                                        2)
                                                        }} ₩</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingDepositPy,
                                                                        2)
                                                        }} ₩</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingIod,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingGdm,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingNoc,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{ leaseItem.askingLeaseTermYear
                                                        }}</td>
                                                        <td class="px-4">{{ leaseItem.askingRentFreeType
                                                        }}</td>
                                                        <td class="px-4">{{ leaseItem.askingRentFreeMth
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingEffectiveNoc,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{ leaseItem.askingFitOut }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingTIAmountKrw,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingTIAmountNfaPy,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingTotalFreeRentPeriodMth,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingTotalOccupyingPeriodYear,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingTotalFreeRentOccupyingYear,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingMonthlyCashSupportGfa,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingAllInEffectiveRentMthPy,
                                                                        2)
                                                        }}</td>
                                                        <td class="px-4">{{
                                                                numberFormat(leaseItem.askingAllInNoc,
                                                                        2)
                                                        }}</td>
                                                </tr>

                                        </tbody>
                                </table>
                        </div>
                </DisclosurePanel>
        </Disclosure>
</template>

<script setup lang="ts">
import {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
} from '@headlessui/vue'

const { info } = defineProps({
        info: {
                required: false,
                type: Object
        }
})
</script>

