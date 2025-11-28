<template>
  <div class="p-6 space-y-6">
    <form @submit.prevent="onSubmit" class="space-y-8 font-financier">

      <!-- Building Info -->
      <fieldset class="border p-4 rounded-lg space-y-4">
        <legend class="text-base font-semibold text-primary px-2">Building Information</legend>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-base font-semibold text-primary mb-2">No. of Buildings</label>
            <input type="number" v-model.number="formData.noOfBuildings"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Upper Levels</label>
            <input type="number" v-model.number="formData.upperLevels"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Basement Levels</label>
            <input type="number" v-model.number="formData.basementLevels"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
        </div>
      </fieldset>

      <!-- Areas -->
      <fieldset class="border p-4 rounded-lg space-y-4">
        <legend class="text-base font-semibold text-primary px-2">Areas</legend>

        <!-- Site Area -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Site Area (Sqm)</label>
            <input type="text" :value="displayValues.siteAreaSqm" @input="e => handleInput(e, 'siteAreaSqm', true)"
              @blur="() => handleBlur('siteAreaSqm')"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Site Area (Py)</label>
            <input type="text" :value="displayValues.siteAreaPy" readonly
              class="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary cursor-not-allowed" />
          </div>
        </div>

        <!-- GFA -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-base font-semibold text-primary mb-2">GFA (Sqm)</label>
            <input type="text" :value="displayValues.gfaSqm" @input="e => handleInput(e, 'gfaSqm', true)"
              @blur="() => handleBlur('gfaSqm')"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">GFA (Py)</label>
            <input type="text" :value="displayValues.gfaPy" readonly
              class="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary cursor-not-allowed" />
          </div>
        </div>

        <!-- NFA -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-base font-semibold text-primary mb-2">NFA (Sqm)</label>
            <input type="text" :value="displayValues.nfaSqm" @input="e => handleInput(e, 'nfaSqm', true)"
              @blur="() => handleBlur('nfaSqm')"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">NFA (Py)</label>
            <input type="text" :value="displayValues.nfaPy" readonly
              class="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary cursor-not-allowed" />
          </div>
        </div>

        <!-- Floor Plate -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Floor Plate (Sqm)</label>
            <input type="text" :value="displayValues.floorPlateSqm" @input="e => handleInput(e, 'floorPlateSqm', true)"
              @blur="() => handleBlur('floorPlateSqm')"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Floor Plate (Py)</label>
            <input type="text" :value="displayValues.floorPlatePy" readonly
              class="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary cursor-not-allowed" />
          </div>
        </div>

        <!-- Gross Leasable Area -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Gross Leasable Area (Sqm)</label>
            <input type="text" :value="displayValues.grossLeasableAreaSqm"
              @input="e => handleInput(e, 'grossLeasableAreaSqm', true)"
              @blur="() => handleBlur('grossLeasableAreaSqm')"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Gross Leasable Area (Py)</label>
            <input type="text" :value="displayValues.grossLeasableAreaPy" readonly
              class="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary cursor-not-allowed" />
          </div>
        </div>

        <!-- Net Leasable Area -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Net Leasable Area (Sqm)</label>
            <input type="text" :value="displayValues.netLeasableAreaSqm"
              @input="e => handleInput(e, 'netLeasableAreaSqm', true)" @blur="() => handleBlur('netLeasableAreaSqm')"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Net Leasable Area (Py)</label>
            <input type="text" :value="displayValues.netLeasableAreaPy" readonly
              class="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary cursor-not-allowed" />
          </div>
        </div>
      </fieldset>

      <!-- Ratios -->
      <fieldset class="border p-4 rounded-lg space-y-4">
        <legend class="text-base font-semibold text-primary px-2">Ratios (%)</legend>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Floor Area Ratio
              (Existing)</label>
            <input type="number" v-model.number="formData.floorAreaRatioExisting" step="0.01"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Floor Area Ratio
              (Permitted)</label>
            <input type="number" v-model.number="formData.floorAreaRatioPermitted" step="0.01"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Building Coverage Ratio
              (Existing)</label>
            <input type="number" v-model.number="formData.buildingCoverageRatioExisting" step="0.01"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
          <div>
            <label class="block text-base font-semibold text-primary mb-2">Building Coverage Ratio
              (Permitted)</label>
            <input type="number" v-model.number="formData.buildingCoverageRatioPermitted" step="0.01"
              class="w-full border border-gray-300 rounded-md p-2 text-right font-calibreLight text-lg text-primary" />
          </div>
        </div>
      </fieldset>

      <div class="flex flex-row items-center justify-end pt-8 border-t font-financierMedium">
        <button type="button" @click="emit('close')"
          class="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-white py-2 px-4 rounded-[10px] mr-4 transition duration-150">Cancel</button>
        <button type="submit" :disabled="computedIsLoading"
          class="bg-cbre_primary_1 hover:bg-cbre_primary_2 text-white py-2 px-4 rounded-[10px] transition duration-150">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertyStore } from '~/stores/property';
import { useStatusStore } from '~/stores/status';
import { useFormat } from '~/composables/useFormat';

const emit = defineEmits(['close']);
const propertyStore = usePropertyStore();
const statusStore = useStatusStore();
const { currentProperty } = storeToRefs(propertyStore);
const { isGlobalLoading: computedIsLoading } = storeToRefs(statusStore);
const { numberFormat, processNumberInput, calculatePyValue } = useFormat();
const { showToast } = useToast();

// --- Initial Data ---
const getInitialData = () => {
  const s = currentProperty.value?.scale;
  return {
    // Building Info
    noOfBuildings: s?.noOfBuildings ?? 0,
    upperLevels: s?.upperLevels ?? 0,
    basementLevels: s?.basementLevels ?? 0,

    // Areas
    siteAreaSqm: s?.siteAreaSqm ?? null,
    siteAreaPy: s?.siteAreaPy ?? null,
    gfaSqm: s?.gfaSqm ?? null,
    gfaPy: s?.gfaPy ?? null,
    nfaSqm: s?.nfaSqm ?? null,
    nfaPy: s?.nfaPy ?? null,
    floorPlateSqm: s?.floorPlateSqm ?? null,
    floorPlatePy: s?.floorPlatePy ?? null,
    grossLeasableAreaSqm: s?.grossLeasableAreaSqm ?? null,
    grossLeasableAreaPy: s?.grossLeasableAreaPy ?? null,
    netLeasableAreaSqm: s?.netLeasableAreaSqm ?? null,
    netLeasableAreaPy: s?.netLeasableAreaPy ?? null,

    // Ratios
    floorAreaRatioExisting: s?.floorAreaRatioExisting ?? null,
    floorAreaRatioPermitted: s?.floorAreaRatioPermitted ?? null,
    buildingCoverageRatioExisting: s?.buildingCoverageRatioExisting ?? null,
    buildingCoverageRatioPermitted: s?.buildingCoverageRatioPermitted ?? null,
  };
};

const formData = reactive(getInitialData());
const displayValues = reactive<Record<string, string>>({});

// --- Initialization ---
const initDisplayValues = () => {
  const keys = [
    'siteAreaSqm', 'siteAreaPy',
    'gfaSqm', 'gfaPy',
    'nfaSqm', 'nfaPy',
    'floorPlateSqm', 'floorPlatePy',
    'grossLeasableAreaSqm', 'grossLeasableAreaPy',
    'netLeasableAreaSqm', 'netLeasableAreaPy'
  ];
  keys.forEach(key => {
    const val = (formData as any)[key];
    displayValues[key] = val !== null ? numberFormat(val, 2) : '';
  });
};

initDisplayValues();

// --- Handlers ---
const handleInput = (e: Event, field: string, isDecimal: boolean) => {
  const val = (e.target as HTMLInputElement).value;
  const { formattedValue, numericValue } = processNumberInput(val, isDecimal);

  displayValues[field] = formattedValue;
  (formData as any)[field] = numericValue;
};

const handleBlur = (field: string) => {
  const numericVal = (formData as any)[field];
  if (numericVal !== null && numericVal !== undefined) {
    // Auto-calculate Py
    const pyField = field.replace('Sqm', 'Py');
    if (pyField !== field && pyField in formData) {
      const pyVal = calculatePyValue(numericVal);
      (formData as any)[pyField] = pyVal;
      displayValues[pyField] = numberFormat(pyVal, 2);
    }
  }
};

// --- Submit ---
const onSubmit = async () => {
  statusStore.setGlobalLoading(true);
  try {
    await propertyStore.updatePropertySection('scale', formData as any);
    emit('close');
    showToast('Scale saved.', 'success');
  } catch (e) {
    showToast('Error saving.', 'danger');
  } finally {
    statusStore.setGlobalLoading(false);
  }
};
</script>
