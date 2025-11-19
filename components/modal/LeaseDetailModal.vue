<template>
        <Transition name="modal-fade">
                <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
                        role="dialog" aria-modal="true">

                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal">
                        </div>

                        <div class="flex items-center justify-center min-h-full p-4">
                                <div
                                        class="w-full max-w-5xl bg-white rounded-lg shadow-xl transform transition-all p-6">

                                        <div class="flex justify-between items-center border-b pb-3 mb-4">
                                                <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                                                        {{ isEditMode ? 'Edit Lease Record' : 'Create New Lease Record'
                                                        }}
                                                </h3>
                                                <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                </button>
                                        </div>

                                        <form @submit.prevent="onSubmit">
                                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-4">

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Lease
                                                                        Type <span class="text-red-500">*</span></label>
                                                                <select v-model="formData.leaseType"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                                        required>
                                                                        <option :value="null" disabled>Select Lease Type
                                                                        </option>
                                                                        <option value="ASKING">ASKING</option>
                                                                        <option value="ACTUAL">ACTUAL</option>
                                                                </select>
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Execution
                                                                        Date <span class="text-red-500">*</span></label>
                                                                <input type="date" v-model="formData.executionDate"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                                        required>
                                                        </div>

                                                        <div class="space-y-1">
                                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div class="space-y-1">

                                                                                <label
                                                                                        class="block text-sm font-medium text-gray-700">Year</label>
                                                                                <input type="number"
                                                                                        v-model="formData.year" readonly
                                                                                        class="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md shadow-sm p-2">
                                                                        </div>

                                                                        <div class="space-y-1">
                                                                                <label
                                                                                        class="block text-sm font-medium text-gray-700">Quarter</label>
                                                                                <input type="text"
                                                                                        v-model="formData.quarter"
                                                                                        readonly
                                                                                        class="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md shadow-sm p-2">
                                                                        </div>

                                                                </div>
                                                        </div>


                                                        <div class="space-y-1">
                                                                <label
                                                                        class="block text-sm font-medium text-gray-700">Floor</label>
                                                                <select v-model="formData.floor"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                                        <option :value="null">Select Floor</option>
                                                                        <option v-for="option in floorOptions"
                                                                                :key="option.value"
                                                                                :value="option.value">
                                                                                {{ option.label }}
                                                                        </option>
                                                                </select>
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label
                                                                        class="block text-sm font-medium text-gray-700">Unit</label>
                                                                <select v-model="formData.unit"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                                        :disabled="!formData.floor">
                                                                        <option :value="null">Select Unit</option>
                                                                        <option v-for="unit in availableUnits"
                                                                                :key="unit" :value="unit">
                                                                                {{ unit }}
                                                                        </option>
                                                                </select>
                                                        </div>

                                                </div>
                                                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Period & Dates
                                                </h4>
                                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-4">

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Lease
                                                                        Term (Year)</label>
                                                                <input type="number" setp="1" min="0"
                                                                        v-model.number="formData.leaseTermYear"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Lease
                                                                        Start Date</label>
                                                                <input type="date" v-model="formData.leaseStartDate"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Lease
                                                                        End Date</label>
                                                                <input type="date" v-model="formData.leaseEndDate"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                        </div>
                                                </div>
                                                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Area &
                                                        Ratio
                                                </h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-4">

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">GFA
                                                                        (m²)</label>
                                                                <!-- <input type="number" v-model.number="formData.gfaSqm"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="gfaSqm" type="text"
                                                                        :value="getDisplayValue('gfaSqm', 2)"
                                                                        @input="e => handleNumberInput(e, 'gfaSqm', true, 2)"
                                                                        placeholder="Gross Floor Area"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">GFA
                                                                        (py)</label>
                                                                <!-- <input type="number" v-model.number="formData.gfaPy"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="gfaPy" type="text"
                                                                        :value="getDisplayValue('gfaPy', 2)"
                                                                        @input="e => handleNumberInput(e, 'gfaPy', true, 2)"
                                                                        placeholder="Gross Floor Area"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">NFA
                                                                        (sqm)</label>
                                                                <!-- <input type="number" v-model.number="formData.nfaSqm"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="nfaSqm" type="text"
                                                                        :value="getDisplayValue('nfaSqm', 2)"
                                                                        @input="e => handleNumberInput(e, 'nfaSqm', true, 2)"
                                                                        placeholder="Net Floor Area"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">NFA
                                                                        (py)</label>
                                                                <!-- <input type="number" v-model.number="formData.nfaPy"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="nfaPy" type="text"
                                                                        :value="getDisplayValue('nfaPy', 2)"
                                                                        @input="e => handleNumberInput(e, 'nfaPy', true, 2)"
                                                                        placeholder="Net Floor Area"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Eff.
                                                                        Ratio (%)</label>
                                                                <!-- <input type="number" v-model.number="formData.effRatio"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="effRatio" type="text"
                                                                        :value="getDisplayValue('effRatio', 2)"
                                                                        @input="e => handleNumberInput(e, 'effRatio', true, 2)"
                                                                        placeholder="e.g. 5.50"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>


                                                </div>

                                                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">Rent &
                                                        Deposit
                                                </h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-4">

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Monthly
                                                                        Rent (KRW)</label>
                                                                <!-- <input type="number"
                                                                        v-model.number="formData.monthlyRent"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="monthlyRent" type="text"
                                                                        :value="getDisplayValue('monthlyRent', 0)"
                                                                        @input="e => handleNumberInput(e, 'monthlyRent', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Rent
                                                                        Monthly (py)</label>
                                                                <!-- <input type="number"
                                                                        v-model.number="formData.rentMonthlyPy"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="rentMonthlyPy" type="text"
                                                                        :value="getDisplayValue('rentMonthlyPy', 0)"
                                                                        @input="e => handleNumberInput(e, 'rentMonthlyPy', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Monthly
                                                                        CAMF (KRW)</label>
                                                                <!-- <input type="number"
                                                                        v-model.number="formData.monthlyCamf"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="monthlyCamf" type="text"
                                                                        :value="getDisplayValue('monthlyCamf', 0)"
                                                                        @input="e => handleNumberInput(e, 'monthlyCamf', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">CAMF
                                                                        Monthly (py)</label>
                                                                <!-- <input type="number"
                                                                        v-model.number="formData.camfMonthlyPy"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="camfMonthlyPy" type="text"
                                                                        :value="getDisplayValue('camfMonthlyPy', 0)"
                                                                        @input="e => handleNumberInput(e, 'camfMonthlyPy', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Deposit
                                                                        (KRW)</label>
                                                                <!-- <input type="number" v-model.number="formData.deposit"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="deposit" type="text"
                                                                        :value="getDisplayValue('deposit', 0)"
                                                                        @input="e => handleNumberInput(e, 'deposit', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Deposit
                                                                        (py)</label>
                                                                <!-- <input type="number" v-model.number="formData.depositPy"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="depositPy" type="text"
                                                                        :value="getDisplayValue('depositPy', 0)"
                                                                        @input="e => handleNumberInput(e, 'depositPy', true, 0)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>


                                                </div>

                                                <h4 class="text-md font-semibold text-gray-900 mb-2 mt-4">
                                                        Indicators &
                                                        Incentives</h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Rent
                                                                        Free Type</label>
                                                                <select v-model="formData.rentFreeType"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                                        <option :value="null">Select Type
                                                                        </option>
                                                                        <option value="PerYear">Per Year
                                                                        </option>
                                                                        <option value="PerTerm">Per Term
                                                                        </option>
                                                                </select>
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Rent
                                                                        Free Month</label>
                                                                <!-- <input type="number"
                                                                        v-model.number="formData.rentFreeMonth"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="rentFreeMonth" type="text"
                                                                        :value="getDisplayValue('rentFreeMonth', 0)"
                                                                        @input="e => handleNumberInput(e, 'rentFreeMonth', true, 0)"
                                                                        placeholder="Months"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Fit
                                                                        Out</label>
                                                                <!-- <input type="number" v-model.number="formData.fitOut"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="fitOut" type="text"
                                                                        :value="getDisplayValue('fitOut', 0)"
                                                                        @input="e => handleNumberInput(e, 'fitOut', true, 0)"
                                                                        placeholder="Number"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">NOC
                                                                        (KRW)</label>
                                                                <!-- <input type="number" v-model.number="formData.noc"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="noc" type="text"
                                                                        :value="getDisplayValue('noc', 2)"
                                                                        @input="e => handleNumberInput(e, 'noc', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>


                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">IOD
                                                                        (KRW)</label>
                                                                <!-- <input type="number" v-model.number="formData.iod"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="iod" type="text"
                                                                        :value="getDisplayValue('iod', 2)"
                                                                        @input="e => handleNumberInput(e, 'iod', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">GDM
                                                                        (KRW)</label>
                                                                <!-- <input type="number" v-model.number="formData.gdm"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="gdm" type="text"
                                                                        :value="getDisplayValue('gdm', 2)"
                                                                        @input="e => handleNumberInput(e, 'gdm', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>


                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Effective
                                                                        NOC (KRW)</label>
                                                                <!-- <input type="number" v-model.number="formData.effectiveNoc"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="effectiveNoc" type="text"
                                                                        :value="getDisplayValue('effectiveNoc', 2)"
                                                                        @input="e => handleNumberInput(e, 'effectiveNoc', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>



                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">TI
                                                                        Amount (KRW)</label>
                                                                <!-- <input type="number" v-model.number="formData.tiAmountKrw"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="tiAmountKrw" type="text"
                                                                        :value="getDisplayValue('tiAmountKrw', 2)"
                                                                        @input="e => handleNumberInput(e, 'tiAmountKrw', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">TI
                                                                        Amount (NFA Py)</label>
                                                                <!-- <input type="number" v-model.number="formData.tiAmountNfaPy"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="tiAmountNfaPy" type="text"
                                                                        :value="getDisplayValue('tiAmountNfaPy', 2)"
                                                                        @input="e => handleNumberInput(e, 'tiAmountNfaPy', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Total
                                                                        Free Rent Period (Month)</label>
                                                                <!-- <input type="number"
                                                                v-model.number="formData.totalFreeRentPeriodMonth"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="totalFreeRentPeriodMonth" type="text"
                                                                        :value="getDisplayValue('totalFreeRentPeriodMonth', 0)"
                                                                        @input="e => handleNumberInput(e, 'totalFreeRentPeriodMonth', true, 0)"
                                                                        placeholder="Months"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Total
                                                                        Occupying Period (Year)</label>
                                                                <!-- <input type="number"
                                                                v-model.number="formData.totalOccupyingPeriodYear"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="totalOccupyingPeriodYear" type="text"
                                                                        :value="getDisplayValue('totalOccupyingPeriodYear', 2)"
                                                                        @input="e => handleNumberInput(e, 'totalOccupyingPeriodYear', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Total
                                                                        Free Rent Occupying (Year)</label>
                                                                <!-- <input type="number"
                                                                v-model.number="formData.totalFreeRentOccupyingYear"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="totalFreeRentOccupyingYear" type="text"
                                                                        :value="getDisplayValue('totalFreeRentOccupyingYear', 2)"
                                                                        @input="e => handleNumberInput(e, 'totalFreeRentOccupyingYear', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">Monthly
                                                                        Cash Support/GFA (KRW, py)</label>
                                                                <!-- <input type="number"
                                                                v-model.number="formData.monthlyCashSupportGfa"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="monthlyCashSupportGfa" type="text"
                                                                        :value="getDisplayValue('monthlyCashSupportGfa', 2)"
                                                                        @input="e => handleNumberInput(e, 'monthlyCashSupportGfa', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">All
                                                                        In Effective Rent Monthly (Py)</label>
                                                                <!-- <input type="number"
                                                                v-model.number="formData.allInEffectiveRentMonthlyPy"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="allInEffectiveRentMonthlyPy" type="text"
                                                                        :value="getDisplayValue('allInEffectiveRentMonthlyPy', 2)"
                                                                        @input="e => handleNumberInput(e, 'allInEffectiveRentMonthlyPy', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>

                                                        <div class="space-y-1">
                                                                <label class="block text-sm font-medium text-gray-700">All
                                                                        In NOC (KRW)</label>
                                                                <!-- <input type="number" v-model.number="formData.allInNoc"
                                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"> -->
                                                                <input id="allInNoc" type="text"
                                                                        :value="getDisplayValue('allInNoc', 2)"
                                                                        @input="e => handleNumberInput(e, 'allInNoc', true, 2)"
                                                                        placeholder="KRW"
                                                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-right" />
                                                        </div>
                                                </div>



                                                <div class="flex justify-end mt-6 space-x-3">
                                                        <button type="button" @click="closeModal"
                                                                class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150">
                                                                Cancel
                                                        </button>
                                                        <button type="submit" :disabled="appStore.isLoading"
                                                                class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cbre_primary_1 hover:bg-cbre_primary_2 transition duration-150 disabled:opacity-50">
                                                                {{ isEditMode ? 'Save Changes' : 'Create Record'
                                                                }}
                                                        </button>
                                                </div>
                                        </form>
                                </div>
                        </div>
                </div>
        </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { useAppStore } from '~/stores/app';
import { usePropertyStore } from '~/stores/property';
import { createToast } from 'mosha-vue-toastify';

import { useFormat } from '~/composables/useFormat';
const {
        numberFormat,
        processNumberInput,
        // cleanNumberField와 cleanStringField는 사용하지 않음
} = useFormat();

import { useConfirmModal } from '~/composables/useConfirmModal';
const { show: openConfirmModal } = useConfirmModal();

import type { TransactionInfoType, RentFreeTypeEnum, LeaseDetailType, FloorType } from '~/types/asset.type';
import type { LeaseCreatePayload } from '~/types/asset.type';

// ************** Store 초기화 **************
const appStore = useAppStore();
const propertyStore = usePropertyStore();

// ************** Props & Emits **************
const props = defineProps<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        leaseData: LeaseDetailType | null;
}>();

const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'save', payload: LeaseCreatePayload): void;
}>();

// ************** State & Computed **************
const isEditMode = computed(() => props.mode === 'edit');
const isOpen = computed(() => props.isOpen);

// 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 반환
const getTodayDateString = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
};


// --- 타입 정의: 모달에서 사용되는 숫자 필드만 추출 ---
type LeaseModalNumericKeys = 'gfaSqm' | 'gfaPy' | 'nfaSqm' | 'nfaPy' | 'effRatio' | 'estCapRate' | 'rentFreeMonthPy' | 'monthlyRent' | 'rentMonthlyPy' | 'monthlyCamf' | 'camfMonthlyPy' | 'deposit' | 'depositPy' | 'iod' | 'gdm' | 'noc' | 'effectiveNoc' | 'fitOut' | 'tiAmountKrw' | 'tiAmountNfaPy' | 'totalFreeRentPeriodMonth' | 'totalOccupyingPeriodYear' | 'totalFreeRentOccupyingYear' | 'monthlyCashSupportGfa' | 'allInEffectiveRentMonthlyPy' | 'allInNoc';
export type LeaseFormInputData = TransactionInfoType | LeaseDetailType;

// --- 숫자 포맷팅 및 입력 핸들러 함수 ---

// 💡 [추가] 뷰 모델 (화면 표시용)
const displayValues = reactive<Record<string, string>>({});

// 💡 [추가] 뷰 모델 값 반환 헬퍼 (Floor.vue 로직)
const getDisplayValue = (
        field: keyof LeaseCreatePayload,
        decimalPlaces: number
) => {
        const key = String(field);
        if (!(key in displayValues)) {
                const value = formData.value[field as keyof LeaseCreatePayload];
                displayValues[key] = (value !== null && value !== undefined) ? numberFormat(value, decimalPlaces) : '';
        }
        return displayValues[key];
};


// 💡 [추가] 숫자 입력 핸들러 (Floor.vue 로직)
const handleNumberInput = (
        e: Event,
        field: keyof LeaseCreatePayload,
        isDecimal: boolean,
        decimalPlaces: number = 0
) => {
        const target = e.target as HTMLInputElement;
        let value = target.value;
        const key = String(field);

        // 1. 💡 공통 함수 호출
        const { cleanedValue, formattedValue, numericValue } = processNumberInput(value, isDecimal, decimalPlaces);

        // 2. 모델 업데이트
        const writableFormData = formData.value as Record<string, any>;
        if (numericValue !== null || cleanedValue === '') {
                writableFormData[field] = numericValue;
        }

        // 3. 뷰(DOM) 업데이트
        displayValues[key] = formattedValue;
        target.value = formattedValue;
};

const roundToTwoDecimals = (num: number | null | undefined): number | null => {
        if (num === null || num === undefined) return null;
        return Math.round(num * 100) / 100;
};

// --- 🚨 [추가] 가격/면적당 가격 계산 함수 ---
const calculateUnitPrice = (price: number | null | undefined, area: number | null | undefined): number | null => {
        if (price === null || price === undefined || area === null || area === undefined || area === 0) {
                return null;
        }
        // 가격은 정수로 반올림
        return Math.round(price / area);
};

const clearDisplayValues = () => {
        for (const key in displayValues) {
                delete displayValues[key];
        }
};



/**
 * 💡 [신규] 날짜에서 Year와 Quarter를 추출하는 헬퍼 함수
 */
const getYearAndQuarterFromDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { year: null, quarter: null };

        const year = date.getFullYear().toString();
        const month = date.getMonth() + 1; // 1월 = 1

        let quarter: string | null;
        if (month >= 1 && month <= 3) quarter = 'Q1';
        else if (month >= 4 && month <= 6) quarter = 'Q2';
        else if (month >= 7 && month <= 9) quarter = 'Q3';
        else if (month >= 10 && month <= 12) quarter = 'Q4';
        else quarter = null;

        return { year, quarter };
};

// 💡 [수정] 초기 폼 데이터 설정: TransactionInfoType 또는 LeaseDetailType을 모두 받도록 시그니처 변경
const getInitialFormData = (data: LeaseFormInputData | null) => {

        // 1. Type Guard 및 데이터 출처 정의
        // 'leaseDetail' 필드는 TransactionInfoType에만 존재합니다. 이를 Type Guard로 사용합니다.
        const isTransactionInfo = data && 'leaseDetail' in data;

        // Transaction Data (year/quarter/date의 소스, TransactionInfoType으로만 좁혀짐)
        const transactionData = isTransactionInfo ? (data as TransactionInfoType) : null;

        // Detail Data (gfaSqm 등의 세부 필드의 소스, LeaseDetailType으로 좁혀짐)
        const detailSource: LeaseDetailType | null = isTransactionInfo
                ? transactionData?.leaseDetail ?? null // TransactionInfoType의 leaseDetail 사용
                : (data as LeaseDetailType | null);      // LeaseDetailType 자체 사용

        const isNew = !data;

        // 2. 날짜 및 연/분기 처리

        // 신규 생성 시 오늘 날짜로 기본 설정
        const defaultDate = isNew
                ? getTodayDateString()
                : (transactionData?.executionDate ? toDateStringOrEmpty(transactionData?.executionDate) : '');

        const { year: calculatedYear, quarter: calculatedQuarter } = getYearAndQuarterFromDate(defaultDate);

        // 3. Lease Detail 기본값 (LeaseDetailType 모델의 모든 필드 포함)
        const initialLeaseDetail: LeaseDetailType = {
                // ID 및 Transaction ID
                leaseId: detailSource?.leaseId ?? '',
                // Transaction ID는 T-Info Type의 id를 우선 사용 (폼에서 ID 역할을 수행), 없으면 detailSource의 transactionId 사용
                transactionId: transactionData?.id ?? detailSource?.transactionId ?? null,

                // 💡 [수정] 나머지 모든 필드는 detailSource에서 가져옵니다.
                leaseType: detailSource?.leaseType ?? null,
                floor: detailSource?.floor ?? null,
                unit: detailSource?.unit ?? null,
                gfaSqm: detailSource?.gfaSqm ?? null,
                gfaPy: detailSource?.gfaPy ?? null,
                nfaSqm: detailSource?.nfaSqm ?? null,
                nfaPy: detailSource?.nfaPy ?? null,
                effRatio: detailSource?.effRatio ?? null,
                monthlyRent: detailSource?.monthlyRent ?? null,
                monthlyCamf: detailSource?.monthlyCamf ?? null,
                deposit: detailSource?.deposit ?? null,
                rentMonthlyPy: detailSource?.rentMonthlyPy ?? null,
                camfMonthlyPy: detailSource?.camfMonthlyPy ?? null,
                depositPy: detailSource?.depositPy ?? null,
                iod: detailSource?.iod ?? null,
                gdm: detailSource?.gdm ?? null,
                noc: detailSource?.noc ?? null,
                leaseTermYear: detailSource?.leaseTermYear ?? null,
                leaseStartDate: detailSource?.leaseStartDate ?? null,
                leaseEndDate: detailSource?.leaseEndDate ?? null,
                rentFreeType: detailSource?.rentFreeType ?? null,
                rentFreeMonth: detailSource?.rentFreeMonth ?? null,
                effectiveNoc: detailSource?.effectiveNoc ?? null,
                fitOut: detailSource?.fitOut ?? null,
                tiAmountKrw: detailSource?.tiAmountKrw ?? null,
                tiAmountNfaPy: detailSource?.tiAmountNfaPy ?? null,
                totalFreeRentPeriodMonth: detailSource?.totalFreeRentPeriodMonth ?? null,
                totalOccupyingPeriodYear: detailSource?.totalOccupyingPeriodYear ?? null,
                totalFreeRentOccupyingYear: detailSource?.totalFreeRentOccupyingYear ?? null,
                monthlyCashSupportGfa: detailSource?.monthlyCashSupportGfa ?? null,
                allInEffectiveRentMonthlyPy: detailSource?.allInEffectiveRentMonthlyPy ?? null,
                allInNoc: detailSource?.allInNoc ?? null,
        };

        // 4. Transaction Info (폼 필드와 매핑)
        const initialTransactionInfo = {
                executionDate: defaultDate, // YYYY-MM-DD 문자열 (폼에서 사용)

                // 💡 [수정] transactionData는 TransactionInfoType | null 이므로 안전하게 접근 가능
                year: transactionData?.year ?? calculatedYear,

                quarter: transactionData?.quarter
                        ? transactionData.quarter.toString().toUpperCase().replace('Q', '').trim()
                        : calculatedQuarter,
        };

        return { ...initialLeaseDetail, ...initialTransactionInfo };
};

const formData = ref(getInitialFormData(null));

// ************** Floor/Unit 관련 Computed & Watchers **************

// 현재 선택된 Floor 객체를 찾습니다.
const selectedFloor = computed<FloorType | undefined>(() => {
        return propertyStore.floorList?.find(f =>
                // floorList의 floor와 type을 합쳐서 저장했다고 가정
                `${f.floor ?? ''}_${f.type ?? ''}` === formData.value.floor
        );
});

// Unit 선택을 위한 목록 (선택된 Floor의 floorPartial.unit 목록)
const availableUnits = computed<string[]>(() => {
        const units = selectedFloor.value?.floorPartial?.map(fp => fp.unitNumber).filter((u): u is string => !!u) ?? [];
        return [...new Set(units)]; // 중복 제거
});

// Floor 선택 목록 (floorList의 floor와 type을 합쳐서 표시)
const floorOptions = computed<{ label: string, value: string }[]>(() => {
        return propertyStore.floorList?.map(f => {
                const value = `${f.floor ?? ''}_${f.type ?? ''}`;
                const label = `${f.floor ?? 'N/A'} (${f.type ?? 'N/A'})`;
                return { label, value };
        }).filter(option => option.value.length > 1) ?? [];
});

watch(
        () => formData.value.floor,
        (newFloor, oldFloor) => {
                // Floor가 변경되면 Unit을 초기화
                if (newFloor !== oldFloor) {
                        formData.value.unit = null;
                }
        }
);

// ************** Watchers **************
watch(
        () => props.isOpen,
        (newVal) => {
                if (newVal) {
                        formData.value = getInitialFormData(props.leaseData);
                } else if (newVal && !props.leaseData) {
                        formData.value = getInitialFormData(null);
                }
        },
        { immediate: true }
);

/**
 * 💡 [신규] Execution Date 변경 시 Year와 Quarter 자동 업데이트
 */
watch(
        () => formData.value.executionDate,
        (newDateString) => {
                if (newDateString) {
                        const { year, quarter } = getYearAndQuarterFromDate(newDateString);
                        formData.value.year = year;
                        formData.value.quarter = quarter;
                } else {
                        formData.value.year = null;
                        formData.value.quarter = null;
                }
        }
);

// 💡 [유지] 날짜 객체를 'YYYY-MM-DD' 문자열로 변환하고 Year/Quarter를 추출하는 헬퍼 함수
const getTransactionDateInfo = (dateValue: any) => {
        // 1. 초기값 및 Falsy 값 체크
        if (!dateValue) {
                return { formattedDate: null, year: null, quarter: null };
        }

        let date: Date;
        let valueToParse: any = dateValue;

        // A. 날짜 피커 객체 처리:
        // 만약 dateValue가 객체이면서 날짜 속성(예: 'date', 'startDate' 등)을 가지고 있다면,
        // 해당 속성 값을 실제 파싱할 값으로 사용합니다.
        if (typeof dateValue === 'object' && dateValue !== null) {
                // v-model로 바인딩된 객체에서 실제 날짜 값을 추출하는 일반적인 시나리오를 처리
                // 예: date-picker가 { date: Date객체 } 형태로 반환하는 경우
                if (dateValue.date) {
                        valueToParse = dateValue.date;
                }
                // 예: 일반적인 Date 객체이지만 Vue에서 Proxy로 감싸진 경우
                else if (dateValue instanceof Date) {
                        valueToParse = dateValue;
                }
                // 예: 날짜 문자열만 직접 value로 들어있는 경우 (Vue ref.value 형태)
                else if (dateValue.toString() !== '[object Object]' && dateValue.toString() !== '') {
                        valueToParse = dateValue;
                }
        }

        // 2. 값 파싱 시도 (valueToParse 사용)
        if (valueToParse instanceof Date) {
                date = valueToParse;
        } else if (typeof valueToParse === 'string') {
                const dateParts = valueToParse.split('-');
                if (dateParts.length === 3) {
                        // YYYY-MM-DD 문자열을 로컬 시간 기준으로 생성하여 시간대 문제 방지
                        date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
                } else {
                        // 다른 형식의 문자열일 경우 일반적인 new Date() 파싱 시도
                        date = new Date(valueToParse);
                }
        } else {
                // 최종적으로 파싱할 수 없는 값이면 Invalid Date로 설정
                date = new Date('');
        }

        // 3. 유효하지 않은 날짜(Invalid Date)인 경우 체크
        if (isNaN(date.getTime())) {
                // 여전히 null이면 디버깅을 위해 콘솔 출력 후 null 반환
                // console.warn("Invalid Date detected for:", dateValue); 
                return { formattedDate: null, year: null, quarter: null };
        }

        // 4. Date 객체로부터 정보 추출 및 포맷팅 (로컬 시간 기준)
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 0-based -> 1-based
        const day = date.getDate();

        // 'YYYY-MM-DD' 형식으로 포맷팅
        const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // 분기 계산
        const quarter = Math.ceil(month / 3).toString();

        return {
                formattedDate: dateString, // 'YYYY-MM-DD'
                year: year.toString(),     // '2025' 문자열로
                quarter: quarter,          // '1', '2', '3', '4' 문자열로
        };
};


watch(
        () => [formData.value.gfaSqm, formData.value.nfaSqm],
        ([newGfaSqm, newNfaSqm]) => {
                if (newGfaSqm) {
                        const newGfaPy = calculatePyValue(newGfaSqm);
                        formData.value.gfaPy = newGfaPy;
                        // 💡 [추가] 자동 계산된 필드의 뷰 모델 업데이트
                        displayValues['gfaPy'] = numberFormat(newGfaPy, 2);
                }


                if (newNfaSqm) {
                        const newNfaPy = calculatePyValue(newNfaSqm);
                        formData.value.nfaPy = newNfaPy;
                        // 💡 [추가] 자동 계산된 필드의 뷰 모델 업데이트
                        displayValues['nfaPy'] = numberFormat(newNfaPy, 2);
                }

        },
        { immediate: true }
);

// ************** Methods **************
const closeModal = () => {
        emit('close');
};

const onSubmit = async () => {

        // 1. 클라이언트 측 유효성 검사
        if (!formData.value.year || !formData.value.executionDate || !formData.value.leaseType) {
                createToast({ title: 'Please fill in required fields (Date, Year, Lease Type).' }, { type: 'warning' });
                return;
        }

        // 2. Quarter 필드 정리 (Qx -> x 또는 null)
        let finalQuarter: string | null = formData.value.quarter || '';
        if (finalQuarter !== '') {
                finalQuarter = finalQuarter.toUpperCase().replace('Q', '');
                if (isNaN(parseInt(finalQuarter, 10))) {
                        finalQuarter = null;
                } else {
                        finalQuarter = finalQuarter.toString();
                }
        }
        if (finalQuarter === '') {
                finalQuarter = null;
        }

        // 2. 입력 데이터 클리닝 및 페이로드 구성
        const payload: LeaseCreatePayload & { transactionId?: string } = {

                // 1. 문자열 필드
                leaseType: formData.value.leaseType,
                floor: formData.value.floor === '' ? null : formData.value.floor,
                unit: formData.value.unit === '' ? null : formData.value.unit,

                // 2. TransactionBasePayload 필드 오버라이드
                year: formData.value.year,
                quarter: finalQuarter,
                executionDate: formData.value.executionDate,

                // // 3. 날짜 필드 포맷팅 오버라이드
                leaseStartDate: getTransactionDateInfo(formData.value.leaseStartDate).formattedDate,
                leaseEndDate: getTransactionDateInfo(formData.value.leaseEndDate).formattedDate,

                // // 4. 숫자 필드 null-coalescing 오버라이드
                gfaSqm: formData.value.gfaSqm ?? null,
                gfaPy: formData.value.gfaPy ?? null,
                nfaSqm: formData.value.nfaSqm ?? null,
                nfaPy: formData.value.nfaPy ?? null,
                effRatio: formData.value.effRatio ?? null,
                monthlyRent: formData.value.monthlyRent ?? null,
                monthlyCamf: formData.value.monthlyCamf ?? null,
                deposit: formData.value.deposit ?? null,
                rentMonthlyPy: formData.value.rentMonthlyPy ?? null,
                camfMonthlyPy: formData.value.camfMonthlyPy ?? null,
                depositPy: formData.value.depositPy ?? null,
                iod: formData.value.iod ?? null,
                gdm: formData.value.gdm ?? null,
                noc: formData.value.noc ?? null,
                leaseTermYear: formData.value.leaseTermYear ?? null,
                rentFreeMonth: formData.value.rentFreeMonth ?? null,
                fitOut: formData.value.fitOut ?? null,

                tiAmountKrw: formData.value.tiAmountKrw ?? null,
                tiAmountNfaPy: formData.value.tiAmountNfaPy ?? null,
                totalFreeRentPeriodMonth: formData.value.totalFreeRentPeriodMonth ?? null,
                totalOccupyingPeriodYear: formData.value.totalOccupyingPeriodYear ?? null,
                totalFreeRentOccupyingYear: formData.value.totalFreeRentOccupyingYear ?? null,
                monthlyCashSupportGfa: formData.value.monthlyCashSupportGfa ?? null,
                allInEffectiveRentMonthlyPy: formData.value.allInEffectiveRentMonthlyPy ?? null,
                allInNoc: formData.value.allInNoc ?? null,

                //6. 💡 [수정] Transaction ID: props.leaseData가 TransactionInfoType(id 필드)으로 취급되므로
                //   id를 가져와 페이로드의 transactionId 키에 할당합니다.
                ...(isEditMode.value && props.leaseData?.transactionId ? { transactionId: props.leaseData.transactionId } : {}),


        } as LeaseCreatePayload & { transactionId?: string };

        //console.log('Submitting Lease Detail Payload:', payload);

        emit('save', payload);
};
</script>


<style scoped>
/* 모달 Transition 스타일 */
.modal-fade-enter-active,
.modal-fade-leave-active {
        transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
        opacity: 0;
}
</style>