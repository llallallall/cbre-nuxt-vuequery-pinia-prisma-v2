import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { ref, computed } from 'vue';
import { useStatusStore } from "~/stores/status";
import type { PropertyType } from '~/types/property.type';

// --- Type Definitions ---
export type Column = { value: string; text: string; };
export type ExcelColumn = { header: string; key: string; width?: number; required?: boolean };

export type SheetData = {
    name: string;
    columns: Column[];
    rows: any[];
    errors: string[];
};

export const useExcel = () => {
    const statusStore = useStatusStore();
    const { showToast } = useToast();

    // --- State ---
    const file = ref<File | string>('');
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const sheetsData = ref<SheetData[]>([]);
    const activeSheetIndex = ref(0);

    // --- Computed ---
    const isDisabled = computed(() => !file.value);
    const totalErrors = computed(() => sheetsData.value.reduce((acc, sheet) => acc + sheet.errors.length, 0));
    const totalValidRows = computed(() => sheetsData.value.reduce((acc, sheet) => acc + sheet.rows.length, 0));
    const hasCriticalErrors = computed(() => totalErrors.value > 0);

    // --- Validation Logic ---
    // --- Column Definitions ---
    const SHEET_COLUMNS: Record<string, ExcelColumn[]> = {
        'General Info': [
            { header: 'Ref_ID', key: 'refId', width: 15, required: true },
            { header: 'Property Name', key: 'name', width: 35, required: true },
            { header: 'Sector ID', key: 'sectorId', width: 15, required: true },
            { header: 'Subsector ID', key: 'subsectorId', width: 15 },
            // Location
            { header: 'Address', key: 'addressFull', width: 40 },
            { header: 'Jibun Address', key: 'addressFullJibun', width: 40 },
            { header: 'Province', key: 'addressProvince', width: 15 },
            { header: 'City', key: 'addressCity', width: 15 },
            { header: 'Latitude', key: 'latitude', width: 12 },
            { header: 'Longitude', key: 'longitude', width: 12 },
            // Scale
            { header: 'No. of Buildings', key: 'noOfBuildings', width: 15 },
            { header: 'Upper Levels', key: 'upperLevels', width: 12 },
            { header: 'Basement Levels', key: 'basementLevels', width: 15 },
            { header: 'GFA (sqm)', key: 'gfaSqm', width: 15 },
            { header: 'GFA (py)', key: 'gfaPy', width: 15 },
            { header: 'NFA (sqm)', key: 'nfaSqm', width: 15 },
            { header: 'NFA (py)', key: 'nfaPy', width: 15 },
            { header: 'Site Area (sqm)', key: 'siteAreaSqm', width: 15 },
            { header: 'Site Area (py)', key: 'siteAreaPy', width: 15 },
            { header: 'GLA (sqm)', key: 'grossLeasableAreaSqm', width: 15 },
            { header: 'GLA (py)', key: 'grossLeasableAreaPy', width: 15 },
            { header: 'NLA (sqm)', key: 'netLeasableAreaSqm', width: 15 },
            { header: 'NLA (py)', key: 'netLeasableAreaPy', width: 15 },
            { header: 'FAR (Existing)', key: 'floorAreaRatioExisting', width: 15 },
            { header: 'FAR (Permitted)', key: 'floorAreaRatioPermitted', width: 15 },
            { header: 'BCR (Existing)', key: 'buildingCoverageRatioExisting', width: 15 },
            { header: 'BCR (Permitted)', key: 'buildingCoverageRatioPermitted', width: 15 },
            { header: 'Floor Plate (sqm)', key: 'floorPlateSqm', width: 18 },
            { header: 'Floor Plate (py)', key: 'floorPlatePy', width: 18 },
            // Facility
            { header: 'Elevators (Total)', key: 'elevatorsTotal', width: 15 },
            { header: 'Elevators (Pass)', key: 'elevatorsPassenger', width: 15 },
            { header: 'Elevators (Svc)', key: 'elevatorsService', width: 15 },
            { header: 'Elevators (Frt)', key: 'elevatorsFreight', width: 15 },
            { header: 'Parking (Exist)', key: 'cpsExisting', width: 15 },
            { header: 'Parking (Req)', key: 'cpsRequired', width: 15 },
            { header: 'Free Parking (sqm)', key: 'freeCpsSqm', width: 18 },
            { header: 'Free Parking (py)', key: 'freeCpsPy', width: 18 },
            { header: 'Paid Parking Fee', key: 'paidParkingFee', width: 18 },
            { header: 'Roof Material', key: 'roofMaterial', width: 20 },
            { header: 'Facade', key: 'facade', width: 20 },
            { header: 'M&E', key: 'mechanicalElectrical', width: 15 },
            { header: 'Lighting', key: 'lighting', width: 20 },
            { header: 'Fire Fighting', key: 'fireFighting', width: 20 },
            // Accessibility
            { header: 'Dist to IC', key: 'distanceToIc', width: 20 },
            { header: 'Time to City Hall', key: 'timeTakenToCityHall', width: 20 },
            { header: 'Time to Subway', key: 'timeTakenToSubway', width: 20 },
            { header: 'Nearby Facilities', key: 'nearbyFacilities', width: 30 },
            { header: 'Nearby Attractions', key: 'nearbyAttractions', width: 30 },
            { header: 'Nearby Places', key: 'nearbyPlaces', width: 30 },
            // Profitability
            { header: 'Grade', key: 'grade', width: 10 },
            { header: 'Eff. Ratio', key: 'effectiveRatio', width: 12 },
        ],
        'Warehouse': [
            { header: 'Property_Ref_ID', key: 'propRefId', width: 20, required: true },
            { header: 'Temperature Type', key: 'temperatureType', width: 20, required: true },
            { header: 'Ratio', key: 'ratio', width: 10 },
        ],
        'Property History': [
            { header: 'Property_Ref_ID', key: 'propRefId', width: 20, required: true },
            { header: 'Year', key: 'year', width: 10, required: true },
            { header: 'Type', key: 'type', width: 20, required: true },
        ],
        'Floor': [
            { header: 'Property_Ref_ID', key: 'propRefId', width: 20, required: true },
            { header: 'Floor', key: 'floor', width: 10, required: true },
            { header: 'Type', key: 'type', width: 15, required: true },
            { header: 'Use', key: 'use', width: 15 },
            { header: 'Total Area (sqm)', key: 'totalAreaSqm', width: 18 },
            { header: 'Total Area (py)', key: 'totalAreaPy', width: 18 },
            { header: 'GLA (sqm)', key: 'grossLeasableAreaSqm', width: 18 },
            { header: 'GLA (py)', key: 'grossLeasableAreaPy', width: 18 },
            { header: 'NLA (sqm)', key: 'netLeasableAreaSqm', width: 18 },
            { header: 'NLA (py)', key: 'netLeasableAreaPy', width: 18 },
            { header: 'Ceiling Height', key: 'ceilingHeight', width: 15 },
            { header: 'Ceiling Unit', key: 'ceilingHeightUnit', width: 12 },
            { header: 'Floor Load', key: 'floorLoad', width: 15 },
            { header: 'Load Unit', key: 'floorLoadUnit', width: 12 },
            { header: 'Truck Berths', key: 'truckBerths', width: 15 },
        ],
        'Floor Partial': [
            { header: 'Property_Ref_ID', key: 'propRefId', width: 20, required: true },
            { header: 'Floor', key: 'floor', width: 10, required: true },
            { header: 'Type', key: 'type', width: 15, required: true }, // Needed to link to Floor
            { header: 'Unit Number', key: 'unitNumber', width: 15 },
            { header: 'Tenant', key: 'tenant', width: 25 },
            { header: 'Lease Area (sqm)', key: 'leaseAreaSqm', width: 18 },
            { header: 'Lease Area (py)', key: 'leaseAreaPy', width: 18 },
            { header: 'Use', key: 'tenantUse', width: 15 },
            { header: 'Tenant Equip', key: 'tenantEquipment', width: 15 },
            { header: 'Lease Start', key: 'leaseStartDate', width: 15 },
            { header: 'Lease End', key: 'leaseEndDate', width: 15 },
            { header: 'Deposit (KRW)', key: 'depositKrw', width: 20 },
            { header: 'Monthly Rent', key: 'monthlyRent', width: 20 },
            { header: 'Rent / py', key: 'monthlyRentPerPy', width: 15 },
            { header: 'Mgmt Fee', key: 'monthlyManagementFee', width: 20 },
            { header: 'Mgmt / py', key: 'monthlyManagementPerPy', width: 15 },
            { header: 'Inc Cond (Dep)', key: 'increaseConditionsForDeposit', width: 25 },
            { header: 'Inc Cond (Rent)', key: 'increaseConditionsForRent', width: 25 },
            { header: 'Inc Cond (Mgmt)', key: 'increaseConditionsForManagementFee', width: 25 },
            { header: 'Rent Free', key: 'rentFree', width: 20 },
            { header: 'Fit Out', key: 'fitOut', width: 20 },
        ],
        'Transaction': [
            { header: 'Ref_ID', key: 'refId', width: 15, required: true },
            { header: 'Property_Ref_ID', key: 'propRefId', width: 20, required: true },
            { header: 'Type', key: 'type', width: 15, required: true },
            { header: 'Year', key: 'year', width: 10, required: true },
            { header: 'Quarter', key: 'quarter', width: 10 },
            { header: 'Execution Date', key: 'executionDate', width: 15 },
        ],
        'Sale': [
            { header: 'Transaction_Ref_ID', key: 'transRefId', width: 20, required: true },
            { header: 'Sale Type', key: 'saleType', width: 15, required: true },
            { header: 'GFA (sqm)', key: 'gfaSqm', width: 15 },
            { header: 'NFA (sqm)', key: 'nfaSqm', width: 15 },
            { header: 'Price (KRW)', key: 'priceKrw', width: 20 },
            { header: 'Price / GFA', key: 'pricePerGfa', width: 15 },
            { header: 'Price / NFA', key: 'pricePerNfa', width: 15 },
            { header: 'Cap Rate', key: 'estCapRate', width: 12 },
            { header: 'Discount Rate', key: 'estDiscountRate', width: 12 },
            { header: 'Buyer', key: 'buyer', width: 20 },
            { header: 'Seller', key: 'seller', width: 20 },
            { header: 'Remarks', key: 'remarks', width: 30 },
        ],
        'Lease': [
            { header: 'Transaction_Ref_ID', key: 'transRefId', width: 20, required: true },
            { header: 'Lease Type', key: 'leaseType', width: 15, required: true },
            { header: 'Floor', key: 'floor', width: 10 },
            { header: 'Unit', key: 'unit', width: 10 },
            { header: 'Lease Start', key: 'leaseStartDate', width: 15 },
            { header: 'Lease End', key: 'leaseEndDate', width: 15 },
            { header: 'GFA (sqm)', key: 'gfaSqm', width: 15 },
            { header: 'GFA (py)', key: 'gfaPy', width: 15 },
            { header: 'NFA (sqm)', key: 'nfaSqm', width: 15 },
            { header: 'NFA (py)', key: 'nfaPy', width: 15 },
            { header: 'Eff. Ratio', key: 'effRatio', width: 12 },
            { header: 'Monthly Rent', key: 'monthlyRent', width: 20 },
            { header: 'Monthly CAMF', key: 'monthlyCamf', width: 20 },
            { header: 'Deposit', key: 'deposit', width: 20 },
            { header: 'Rent / py', key: 'rentMonthlyPy', width: 15 },
            { header: 'CAMF / py', key: 'camfMonthlyPy', width: 15 },
            { header: 'Deposit / py', key: 'depositPy', width: 15 },
            { header: 'IOD', key: 'iod', width: 12 },
            { header: 'GDM', key: 'gdm', width: 12 },
            { header: 'NOC', key: 'noc', width: 12 },
            { header: 'Lease Term', key: 'leaseTermYear', width: 12 },
            { header: 'RF Type', key: 'rentFreeType', width: 15 },
            { header: 'RF Month', key: 'rentFreeMonth', width: 12 },
            { header: 'Eff. NOC', key: 'effectiveNoc', width: 12 },
        ],
    };

    // Derived for validation
    const REQUIRED_COLUMNS = Object.fromEntries(
        Object.entries(SHEET_COLUMNS).map(([sheet, cols]) => [
            sheet,
            cols.filter(c => c.required).map(c => c.header)
        ])
    );

    const validateSheet = (sheetName: string, rows: any[], allSheets: Record<string, any[]>): string[] => {
        const errors: string[] = [];
        const requiredCols = REQUIRED_COLUMNS[sheetName];

        if (!requiredCols) return errors;

        // 1. Check for Ref_ID uniqueness in General Info and Transaction
        if (sheetName === 'General Info' || sheetName === 'Transaction') {
            const refIds = new Set();
            rows.forEach((row, index) => {
                if (!row['Ref_ID']) {
                    errors.push(`Row ${index + 2}: Missing 'Ref_ID'.`);
                } else {
                    if (refIds.has(row['Ref_ID'])) {
                        errors.push(`Row ${index + 2}: Duplicate 'Ref_ID' ${row['Ref_ID']}.`);
                    }
                    refIds.add(row['Ref_ID']);
                }
                // Specific checks
                if (sheetName === 'General Info' && !row['Property Name']) errors.push(`Row ${index + 2}: Missing 'Property Name'.`);
            });
        }

        // 2. Check Property_Ref_ID existence
        if (['Warehouse', 'Property History', 'Floor', 'Floor Partial', 'Transaction'].includes(sheetName)) {
            const generalInfoSheet = allSheets['General Info'];
            if (!generalInfoSheet) {
                errors.push(`Parent sheet 'General Info' is missing.`);
                return errors;
            }

            const validRefIds = new Set(generalInfoSheet.map((r: any) => r['Ref_ID']));

            rows.forEach((row, index) => {
                const refId = row['Property_Ref_ID'];
                if (!refId) {
                    errors.push(`Row ${index + 2}: Missing 'Property_Ref_ID'.`);
                } else if (!validRefIds.has(refId)) {
                    errors.push(`Row ${index + 2}: Invalid 'Property_Ref_ID' ${refId} (does not exist in General Info).`);
                }
            });
        }

        // 3. Check Transaction_Ref_ID existence
        if (['Sale', 'Lease'].includes(sheetName)) {
            const transactionSheet = allSheets['Transaction'];
            if (!transactionSheet) {
                errors.push(`Parent sheet 'Transaction' is missing.`);
                return errors;
            }

            const validTransIds = new Set(transactionSheet.map((r: any) => r['Ref_ID']));

            rows.forEach((row, index) => {
                const refId = row['Transaction_Ref_ID'];
                if (!refId) {
                    errors.push(`Row ${index + 2}: Missing 'Transaction_Ref_ID'.`);
                } else if (!validTransIds.has(refId)) {
                    errors.push(`Row ${index + 2}: Invalid 'Transaction_Ref_ID' ${refId} (does not exist in Transaction).`);
                }
            });
        }

        return errors;
    };

    const resetUpload = () => {
        file.value = '';
        sheetsData.value = [];
        activeSheetIndex.value = 0;

        if (fileInputRef.value) {
            fileInputRef.value.value = '';
        }
    }

    const parseExcel = (event: Event) => {
        statusStore.setGlobalLoading(true, 'filePreview');

        const target = event.target as HTMLInputElement;

        if (target.files && target.files[0]) {
            file.value = target.files[0];
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const data = e.target?.result as ArrayBuffer;
                    const workbook = new Excel.Workbook();
                    await workbook.xlsx.load(data);

                    const parsedSheets: SheetData[] = [];
                    const allSheetsData: Record<string, any[]> = {};

                    // First pass: Parse all data
                    workbook.eachSheet((worksheet, sheetId) => {
                        const jsonData: any[] = [];
                        let headers: string[] = [];

                        worksheet.eachRow((row, rowNumber) => {
                            if (rowNumber === 1) {
                                row.eachCell((cell, colNumber) => {
                                    headers[colNumber - 1] = cell.text ? cell.text.toString().trim() : '';
                                });
                            } else {
                                const rowData: any = {};
                                let hasData = false;
                                row.eachCell((cell, colNumber) => {
                                    const header = headers[colNumber - 1];
                                    if (header) {
                                        const cellValue = cell.value;
                                        rowData[header] = (typeof cellValue === 'object' && cellValue !== null && 'text' in cellValue)
                                            ? (cellValue as any).text
                                            : cellValue;
                                        hasData = true;
                                    }
                                });
                                if (hasData) {
                                    jsonData.push(rowData);
                                }
                            }
                        });

                        if (jsonData.length > 0) {
                            allSheetsData[worksheet.name] = jsonData;

                            const sheetColumns: Column[] = headers.map(key => ({
                                value: key,
                                text: key,
                            }));

                            parsedSheets.push({
                                name: worksheet.name,
                                columns: sheetColumns,
                                rows: jsonData,
                                errors: [] // Will fill in next pass
                            });
                        }
                    });

                    // Second pass: Validate
                    parsedSheets.forEach(sheet => {
                        sheet.errors = validateSheet(sheet.name, sheet.rows, allSheetsData);
                    });

                    sheetsData.value = parsedSheets;
                    activeSheetIndex.value = 0;

                    if (totalErrors.value > 0) {
                        showToast({
                            title: 'Validation Errors Found',
                            description: 'Please check the summary and fix errors before uploading.'
                        }, 'warning', { timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });
                    }

                } catch (error) {
                    console.error("Error parsing Excel file:", error);
                    showToast({
                        title: 'Failed to read the Excel file.',
                        description: 'It might be corrupted or in an unsupported format.'
                    }, 'danger', { timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });

                    resetUpload();
                } finally {
                    statusStore.setGlobalLoading(false);
                }
            };

            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                showToast({
                    title: 'Error reading file.',
                    description: 'Please try again.'
                }, 'danger', { timeout: 5000, showCloseButton: true, position: 'top-right', transition: 'bounce' });

                statusStore.setGlobalLoading(false);
            };

            reader.readAsArrayBuffer(file.value as File);
        } else {
            resetUpload();
            statusStore.setGlobalLoading(false);
        }
    };

    const applyHeaderStyle = (sheet: Excel.Worksheet) => {
        const headerRow = sheet.getRow(1);

        // Apply styles to each cell in the header row
        headerRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF006A4D' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Add auto-filter
        if (sheet.columns && sheet.columns.length > 0) {
            sheet.autoFilter = {
                from: { row: 1, column: 1 },
                to: { row: 1, column: sheet.columns.length }
            };
        }
    };

    const downloadSampleExcel = async () => {
        const workbook = new Excel.Workbook();
        workbook.creator = 'CBRE';
        workbook.lastModifiedBy = 'CBRE';
        workbook.created = new Date();
        workbook.modified = new Date();

        for (const [sheetName, columns] of Object.entries(SHEET_COLUMNS)) {
            const sheet = workbook.addWorksheet(sheetName);
            sheet.columns = columns.map(col => ({
                header: col.header,
                key: col.key,
                width: col.width || 15
            }));

            applyHeaderStyle(sheet);

            // Add a dummy row
            const dummyRow: any = {};
            columns.forEach(col => {
                if (col.key === 'refId' || col.key === 'propRefId' || col.key === 'transRefId' || col.key === 'floorRefId') {
                    dummyRow[col.key] = 'REF_001';
                } else if (col.key === 'year') {
                    dummyRow[col.key] = new Date().getFullYear();
                } else if (col.key.includes('Sqm') || col.key.includes('Py') || col.key.includes('Fee') || col.key.includes('Price') || col.key.includes('Rent')) {
                    dummyRow[col.key] = 100;
                } else {
                    dummyRow[col.key] = col.required ? 'Sample' : '';
                }
            });
            sheet.addRow(dummyRow);
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `CBRE_Property_Upload_Sample.xlsx`);
    };

    const downloadExcel = async (properties: any[]) => {
        const workbook = new Excel.Workbook();
        workbook.creator = 'CBRE';
        workbook.lastModifiedBy = 'CBRE';
        workbook.created = new Date();
        workbook.modified = new Date();

        // 1. General Info
        const sheetGeneral = workbook.addWorksheet('General Info');
        sheetGeneral.columns = SHEET_COLUMNS['General Info'].map(c => ({ header: c.header, key: c.key, width: c.width }));

        properties.forEach(p => {
            const warehouseInfo = p.warehouse?.map((w: any) => `${w.temperatureType}(${w.ratio}%)`).join(', ') || '';
            sheetGeneral.addRow({
                refId: p.id,
                name: p.name,
                sectorId: p.sector?.name || '',
                subsectorId: p.subsector?.name || '',
                addressFull: p.location?.addressFull || '',
                addressFullJibun: p.location?.addressFullJibun || '',
                addressProvince: p.location?.addressProvince || '',
                addressCity: p.location?.addressCity || '',
                latitude: p.location?.latitude || '',
                longitude: p.location?.longitude || '',
                noOfBuildings: p.scale?.noOfBuildings || 0,
                upperLevels: p.scale?.upperLevels || 0,
                basementLevels: p.scale?.basementLevels || 0,
                gfaSqm: p.scale?.gfaSqm || 0,
                gfaPy: p.scale?.gfaPy || 0,
                nfaSqm: p.scale?.nfaSqm || 0,
                nfaPy: p.scale?.nfaPy || 0,
                siteAreaSqm: p.scale?.siteAreaSqm || 0,
                siteAreaPy: p.scale?.siteAreaPy || 0,
                grossLeasableAreaSqm: p.scale?.grossLeasableAreaSqm || 0,
                grossLeasableAreaPy: p.scale?.grossLeasableAreaPy || 0,
                netLeasableAreaSqm: p.scale?.netLeasableAreaSqm || 0,
                netLeasableAreaPy: p.scale?.netLeasableAreaPy || 0,
                floorAreaRatioExisting: p.scale?.floorAreaRatioExisting || 0,
                floorAreaRatioPermitted: p.scale?.floorAreaRatioPermitted || 0,
                buildingCoverageRatioExisting: p.scale?.buildingCoverageRatioExisting || 0,
                buildingCoverageRatioPermitted: p.scale?.buildingCoverageRatioPermitted || 0,
                floorPlateSqm: p.scale?.floorPlateSqm || 0,
                floorPlatePy: p.scale?.floorPlatePy || 0,
                elevatorsTotal: p.facility?.elevatorsTotal || 0,
                elevatorsPassenger: p.facility?.elevatorsPassenger || 0,
                elevatorsService: p.facility?.elevatorsService || 0,
                elevatorsFreight: p.facility?.elevatorsFreight || 0,
                cpsExisting: p.facility?.cpsExisting || 0,
                cpsRequired: p.facility?.cpsRequired || 0,
                freeCpsSqm: p.facility?.freeCpsSqm || 0,
                freeCpsPy: p.facility?.freeCpsPy || 0,
                paidParkingFee: p.facility?.paidParkingFee || 0,
                roofMaterial: p.facility?.roofMaterial || '',
                facade: p.facility?.facade || '',
                mechanicalElectrical: p.facility?.mechanicalElectrical || 0,
                lighting: p.facility?.lighting || '',
                fireFighting: p.facility?.fireFighting || '',
                distanceToIc: p.accessibility?.distanceToIc || '',
                timeTakenToCityHall: p.accessibility?.timeTakenToCityHall || '',
                timeTakenToSubway: p.accessibility?.timeTakenToSubway || '',
                nearbyFacilities: p.accessibility?.nearbyFacilities || '',
                nearbyAttractions: p.accessibility?.nearbyAttractions || '',
                nearbyPlaces: p.accessibility?.nearbyPlaces || '',
                grade: p.profitability?.grade || '',
                effectiveRatio: p.profitability?.effectiveRatio || 0,
                warehouseTypes: warehouseInfo,
            });
        });
        applyHeaderStyle(sheetGeneral);

        // 2. Warehouse
        const sheetWarehouse = workbook.addWorksheet('Warehouse');
        sheetWarehouse.columns = SHEET_COLUMNS['Warehouse'].map(c => ({ header: c.header, key: c.key, width: c.width }));
        properties.forEach(p => {
            p.warehouse?.forEach((w: any) => {
                sheetWarehouse.addRow({
                    propRefId: p.id,
                    temperatureType: w.temperatureType,
                    ratio: w.ratio
                });
            });
        });
        applyHeaderStyle(sheetWarehouse);

        // 3. Property History
        const sheetHistory = workbook.addWorksheet('Property History');
        sheetHistory.columns = SHEET_COLUMNS['Property History'].map(c => ({ header: c.header, key: c.key, width: c.width }));
        properties.forEach(p => {
            p.history?.forEach((h: any) => {
                sheetHistory.addRow({
                    propRefId: p.id,
                    year: h.year,
                    type: h.type
                });
            });
        });
        applyHeaderStyle(sheetHistory);

        // 4. Floor
        const sheetFloor = workbook.addWorksheet('Floor');
        sheetFloor.columns = SHEET_COLUMNS['Floor'].map(c => ({ header: c.header, key: c.key, width: c.width }));
        properties.forEach(p => {
            p.floor?.forEach((f: any) => {
                sheetFloor.addRow({
                    propRefId: p.id,
                    floor: f.floor,
                    type: f.type,
                    use: f.use,
                    totalAreaSqm: f.totalAreaSqm,
                    totalAreaPy: f.totalAreaPy,
                    glaSqm: f.grossLeasableAreaSqm,
                    glaPy: f.grossLeasableAreaPy,
                    nlaSqm: f.netLeasableAreaSqm,
                    nlaPy: f.netLeasableAreaPy,
                    ceilingHeight: f.ceilingHeight,
                    ceilingHeightUnit: f.ceilingHeightUnit,
                    floorLoad: f.floorLoad,
                    floorLoadUnit: f.floorLoadUnit,
                    truckBerths: f.truckBerths
                });
            });
        });
        applyHeaderStyle(sheetFloor);

        // 5. Floor Partial
        const sheetFloorPartial = workbook.addWorksheet('Floor Partial');
        sheetFloorPartial.columns = SHEET_COLUMNS['Floor Partial'].map(c => ({ header: c.header, key: c.key, width: c.width }));
        properties.forEach(p => {
            p.floor?.forEach((f: any) => {
                f.floorPartial?.forEach((fp: any) => {
                    sheetFloorPartial.addRow({
                        propRefId: p.id,
                        floor: f.floor,
                        type: f.type,
                        unitNumber: fp.unitNumber,
                        tenant: fp.tenant,
                        leaseAreaSqm: fp.leaseAreaSqm,
                        leaseAreaPy: fp.leaseAreaPy,
                        tenantUse: fp.tenantUse,
                        tenantEquipment: fp.tenantEquipment,
                        leaseStartDate: fp.leaseStartDate,
                        leaseEndDate: fp.leaseEndDate,
                        depositKrw: fp.depositKrw,
                        monthlyRent: fp.monthlyRent,
                        monthlyRentPerPy: fp.monthlyRentPerPy,
                        monthlyManagementFee: fp.monthlyManagementFee,
                        monthlyManagementPerPy: fp.monthlyManagementPerPy,
                        increaseConditionsForDeposit: fp.increaseConditionsForDeposit,
                        increaseConditionsForRent: fp.increaseConditionsForRent,
                        increaseConditionsForManagementFee: fp.increaseConditionsForManagementFee,
                        rentFree: fp.rentFree,
                        fitOut: fp.fitOut
                    });
                });
            });
        });
        applyHeaderStyle(sheetFloorPartial);

        // 6. Transaction
        const sheetTransaction = workbook.addWorksheet('Transaction');
        sheetTransaction.columns = SHEET_COLUMNS['Transaction'].map(c => ({ header: c.header, key: c.key, width: c.width }));
        properties.forEach(p => {
            p.transaction?.forEach((t: any) => {
                sheetTransaction.addRow({
                    refId: t.id,
                    propRefId: p.id,
                    type: t.type,
                    year: t.year,
                    quarter: t.quarter,
                    executionDate: t.executionDate
                });
            });
        });
        applyHeaderStyle(sheetTransaction);

        // 7. Sale
        const sheetSale = workbook.addWorksheet('Sale');
        sheetSale.columns = SHEET_COLUMNS['Sale'].map(c => ({ header: c.header, key: c.key, width: c.width }));
        properties.forEach(p => {
            p.transaction?.forEach((t: any) => {
                if (t.sale) {
                    sheetSale.addRow({
                        transRefId: t.id,
                        saleType: t.sale.saleType,
                        gfaSqm: t.sale.gfaSqm,
                        nfaSqm: t.sale.nfaSqm,
                        priceKrw: t.sale.priceKrw,
                        pricePerGfa: t.sale.pricePerGfa,
                        pricePerNfa: t.sale.pricePerNfa,
                        estCapRate: t.sale.estCapRate,
                        estDiscountRate: t.sale.estDiscountRate,
                        buyer: t.sale.buyer,
                        seller: t.sale.seller,
                        remarks: t.sale.remarks
                    });
                }
            });
        });
        applyHeaderStyle(sheetSale);

        // 8. Lease
        const sheetLease = workbook.addWorksheet('Lease');
        sheetLease.columns = SHEET_COLUMNS['Lease'].map(c => ({ header: c.header, key: c.key, width: c.width }));
        properties.forEach(p => {
            p.transaction?.forEach((t: any) => {
                if (t.lease) {
                    sheetLease.addRow({
                        transRefId: t.id,
                        leaseType: t.lease.leaseType,
                        floor: t.lease.floor,
                        unit: t.lease.unit,
                        leaseStartDate: t.lease.leaseStartDate,
                        leaseEndDate: t.lease.leaseEndDate,
                        gfaSqm: t.lease.gfaSqm,
                        gfaPy: t.lease.gfaPy,
                        nfaSqm: t.lease.nfaSqm,
                        nfaPy: t.lease.nfaPy,
                        effRatio: t.lease.effRatio,
                        monthlyRent: t.lease.monthlyRent,
                        monthlyCamf: t.lease.monthlyCamf,
                        deposit: t.lease.deposit,
                        rentMonthlyPy: t.lease.rentMonthlyPy,
                        camfMonthlyPy: t.lease.camfMonthlyPy,
                        depositPy: t.lease.depositPy,
                        iod: t.lease.iod,
                        gdm: t.lease.gdm,
                        noc: t.lease.noc,
                        leaseTermYear: t.lease.leaseTermYear,
                        rentFreeType: t.lease.rentFreeType,
                        rentFreeMonth: t.lease.rentFreeMonth,
                        effectiveNoc: t.lease.effectiveNoc
                    });
                }
            });
        });
        applyHeaderStyle(sheetLease);

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `CBRE_Property_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return {
        downloadExcel,
        downloadSampleExcel,
        parseExcel,
        resetUpload,
        file,
        fileInputRef,
        sheetsData,
        activeSheetIndex,
        isDisabled,
        totalErrors,
        totalValidRows,
        hasCriticalErrors
    };
};
