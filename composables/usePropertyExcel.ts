import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import type { PropertyType } from '~/types/property.type';

export const usePropertyExcel = () => {
        const downloadPropertyExcel = async (properties: PropertyType[]) => {
                const workbook = new Excel.Workbook();
                workbook.creator = 'CBRE';
                workbook.lastModifiedBy = 'CBRE';
                workbook.created = new Date();
                workbook.modified = new Date();

                // Helper for header styling
                const applyHeaderStyle = (sheet: Excel.Worksheet) => {
                        const headerRow = sheet.getRow(1);
                        headerRow.height = 24;
                        headerRow.eachCell((cell) => {
                                cell.fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'FF006A4D' } // CBRE Green-ish or dark green
                                };
                                cell.font = {
                                        bold: true,
                                        color: { argb: 'FFFFFFFF' }, // White text
                                        size: 12
                                };
                                cell.alignment = {
                                        vertical: 'middle',
                                        horizontal: 'center'
                                };
                                cell.border = {
                                        top: { style: 'thin' },
                                        left: { style: 'thin' },
                                        bottom: { style: 'thin' },
                                        right: { style: 'thin' }
                                };
                        });
                };

                // Map to store property ID to Number mapping
                const propertyNoMap = new Map<string, number>();

                // --- 1. General Info Sheet ---
                const sheetGeneral = workbook.addWorksheet('General Info');
                sheetGeneral.columns = [
                        { header: 'No.', key: 'no', width: 8 },
                        { header: 'Property Name', key: 'name', width: 30 },
                        { header: 'Grade', key: 'grade', width: 10 },
                        { header: 'Sector', key: 'sector', width: 15 },
                        { header: 'SubSector', key: 'subsector', width: 15 },

                        // Location
                        { header: 'Address', key: 'address', width: 50 },
                        { header: 'Jibun Address', key: 'addressJibun', width: 50 },
                        { header: 'Province', key: 'province', width: 15 },
                        { header: 'City', key: 'city', width: 15 },
                        { header: 'Latitude', key: 'latitude', width: 15 },
                        { header: 'Longitude', key: 'longitude', width: 15 },

                        // Scale
                        { header: 'No. of Buildings', key: 'noOfBuildings', width: 15 },
                        { header: 'Upper Levels', key: 'upperLevels', width: 15 },
                        { header: 'Basement Levels', key: 'basementLevels', width: 15 },
                        { header: 'GFA (sqm)', key: 'gfaSqm', width: 15 },
                        { header: 'GFA (py)', key: 'gfaPy', width: 15 },
                        { header: 'NFA (sqm)', key: 'nfaSqm', width: 15 },
                        { header: 'NFA (py)', key: 'nfaPy', width: 15 },
                        { header: 'Site Area (sqm)', key: 'siteAreaSqm', width: 15 },
                        { header: 'Site Area (py)', key: 'siteAreaPy', width: 15 },
                        { header: 'GLA (sqm)', key: 'glaSqm', width: 15 },
                        { header: 'GLA (py)', key: 'glaPy', width: 15 },
                        { header: 'NLA (sqm)', key: 'nlaSqm', width: 15 },
                        { header: 'NLA (py)', key: 'nlaPy', width: 15 },
                        { header: 'FAR (Existing)', key: 'farExisting', width: 15 },
                        { header: 'FAR (Permitted)', key: 'farPermitted', width: 15 },
                        { header: 'BCR (Existing)', key: 'bcrExisting', width: 15 },
                        { header: 'BCR (Permitted)', key: 'bcrPermitted', width: 15 },
                        { header: 'Floor Plate (sqm)', key: 'floorPlateSqm', width: 15 },
                        { header: 'Floor Plate (py)', key: 'floorPlatePy', width: 15 },

                        // Facility
                        { header: 'Elevators (Total)', key: 'elevatorsTotal', width: 15 },
                        { header: 'Elevators (Passenger)', key: 'elevatorsPassenger', width: 15 },
                        { header: 'Elevators (Service)', key: 'elevatorsService', width: 15 },
                        { header: 'Elevators (Freight)', key: 'elevatorsFreight', width: 15 },
                        { header: 'Parking (Existing)', key: 'cpsExisting', width: 15 },
                        { header: 'Parking (Required)', key: 'cpsRequired', width: 15 },
                        { header: 'Free Parking (sqm)', key: 'freeCpsSqm', width: 15 },
                        { header: 'Free Parking (py)', key: 'freeCpsPy', width: 15 },
                        { header: 'Paid Parking Fee', key: 'paidParkingFee', width: 15 },
                        { header: 'Roof Material', key: 'roofMaterial', width: 20 },
                        { header: 'Facade', key: 'facade', width: 20 },
                        { header: 'M&E', key: 'mechanicalElectrical', width: 15 },
                        { header: 'Lighting', key: 'lighting', width: 20 },
                        { header: 'Fire Fighting', key: 'fireFighting', width: 20 },

                        // Accessibility
                        { header: 'Distance to IC', key: 'distanceToIc', width: 20 },
                        { header: 'Time to City Hall', key: 'timeTakenToCityHall', width: 20 },
                        { header: 'Time to Subway', key: 'timeTakenToSubway', width: 20 },
                        { header: 'Nearby Facilities', key: 'nearbyFacilities', width: 30 },
                        { header: 'Nearby Attractions', key: 'nearbyAttractions', width: 30 },
                        { header: 'Nearby Places', key: 'nearbyPlaces', width: 30 },

                        // Profitability
                        { header: 'Eff. Ratio', key: 'effectiveRatio', width: 15 },

                        // Warehouse
                        { header: 'Warehouse Types', key: 'warehouseTypes', width: 30 },

                        // History
                        { header: 'Completion Date', key: 'completionDate', width: 15 },
                        { header: 'Renovation Date', key: 'renovationDate', width: 15 },
                ];

                properties.forEach((p, index) => {
                        const no = index + 1;
                        propertyNoMap.set(p.id, no);

                        const warehouseInfo = p.warehouse?.map(w => `${w.temperatureType}(${w.ratio}%)`).join(', ') || '';
                        const completionDate = p.history?.find(h => h.type === 'COMPLETION')?.year || '';
                        const renovationDate = p.history?.find(h => h.type === 'RENOVATION')?.year || '';

                        sheetGeneral.addRow({
                                no: no,
                                name: p.name,
                                grade: p.profitability?.grade || '',
                                sector: p.sector?.name || '',
                                subsector: p.subsector?.name || '',

                                // Location
                                address: p.location?.addressFull || '',
                                addressJibun: p.location?.addressFullJibun || '',
                                province: p.location?.addressProvince || '',
                                city: p.location?.addressCity || '',
                                latitude: p.location?.latitude || '',
                                longitude: p.location?.longitude || '',

                                // Scale
                                noOfBuildings: p.scale?.noOfBuildings || 0,
                                upperLevels: p.scale?.upperLevels || 0,
                                basementLevels: p.scale?.basementLevels || 0,
                                gfaSqm: p.scale?.gfaSqm || 0,
                                gfaPy: p.scale?.gfaPy || 0,
                                nfaSqm: p.scale?.nfaSqm || 0,
                                nfaPy: p.scale?.nfaPy || 0,
                                siteAreaSqm: p.scale?.siteAreaSqm || 0,
                                siteAreaPy: p.scale?.siteAreaPy || 0,
                                glaSqm: p.scale?.grossLeasableAreaSqm || 0,
                                glaPy: p.scale?.grossLeasableAreaPy || 0,
                                nlaSqm: p.scale?.netLeasableAreaSqm || 0,
                                nlaPy: p.scale?.netLeasableAreaPy || 0,
                                farExisting: p.scale?.floorAreaRatioExisting || 0,
                                farPermitted: p.scale?.floorAreaRatioPermitted || 0,
                                bcrExisting: p.scale?.buildingCoverageRatioExisting || 0,
                                bcrPermitted: p.scale?.buildingCoverageRatioPermitted || 0,
                                floorPlateSqm: p.scale?.floorPlateSqm || 0,
                                floorPlatePy: p.scale?.floorPlatePy || 0,

                                // Facility
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

                                // Accessibility
                                distanceToIc: p.accessibility?.distanceToIc || '',
                                timeTakenToCityHall: p.accessibility?.timeTakenToCityHall || '',
                                timeTakenToSubway: p.accessibility?.timeTakenToSubway || '',
                                nearbyFacilities: p.accessibility?.nearbyFacilities || '',
                                nearbyAttractions: p.accessibility?.nearbyAttractions || '',
                                nearbyPlaces: p.accessibility?.nearbyPlaces || '',

                                // Profitability
                                effectiveRatio: p.profitability?.effectiveRatio || 0,

                                // Warehouse
                                warehouseTypes: warehouseInfo,

                                // History
                                completionDate: completionDate,
                                renovationDate: renovationDate,
                        });
                });
                applyHeaderStyle(sheetGeneral);

                // --- 2. Floor Info Sheet ---
                const sheetFloor = workbook.addWorksheet('Floor Info');
                sheetFloor.columns = [
                        { header: 'No.', key: 'no', width: 8 },
                        { header: 'Property Name', key: 'propertyName', width: 35 },
                        { header: 'Floor', key: 'floor', width: 10 },
                        { header: 'Type', key: 'type', width: 15 },
                        { header: 'Use', key: 'use', width: 15 },
                        { header: 'Total Area (sqm)', key: 'totalAreaSqm', width: 15 },
                        { header: 'Total Area (py)', key: 'totalAreaPy', width: 15 },
                        { header: 'GLA (sqm)', key: 'glaSqm', width: 15 },
                        { header: 'GLA (py)', key: 'glaPy', width: 15 },
                        { header: 'NLA (sqm)', key: 'nlaSqm', width: 15 },
                        { header: 'NLA (py)', key: 'nlaPy', width: 15 },
                        { header: 'Ceiling Height', key: 'ceilingHeight', width: 15 },
                        { header: 'Ceiling Height Unit', key: 'ceilingHeightUnit', width: 15 },
                        { header: 'Floor Load', key: 'floorLoad', width: 15 },
                        { header: 'Floor Load Unit', key: 'floorLoadUnit', width: 15 },
                        { header: 'Truck Berths', key: 'truckBerths', width: 15 },
                ];

                properties.forEach(p => {
                        const no = propertyNoMap.get(p.id);
                        if (p.floor && p.floor.length > 0) {
                                p.floor.forEach(f => {
                                        sheetFloor.addRow({
                                                no: no,
                                                propertyName: p.name,
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
                                                truckBerths: f.truckBerths,
                                        });
                                });
                        }
                });
                applyHeaderStyle(sheetFloor);

                // --- 3. Floor Partial Info Sheet ---
                const sheetFloorPartial = workbook.addWorksheet('Floor Partial Info');
                sheetFloorPartial.columns = [
                        { header: 'No.', key: 'no', width: 8 },
                        { header: 'Property Name', key: 'propertyName', width: 35 },
                        { header: 'Floor', key: 'floor', width: 10 },
                        { header: 'Unit', key: 'unit', width: 10 },
                        { header: 'Tenant', key: 'tenant', width: 30 },
                        { header: 'Lease Area (sqm)', key: 'leaseAreaSqm', width: 15 },
                        { header: 'Lease Area (py)', key: 'leaseAreaPy', width: 15 },
                        { header: 'Use', key: 'use', width: 15 },
                        { header: 'Tenant Equipment', key: 'tenantEquipment', width: 15 },
                        { header: 'Lease Start', key: 'leaseStartDate', width: 15 },
                        { header: 'Lease End', key: 'leaseEndDate', width: 15 },
                        { header: 'Deposit (KRW)', key: 'depositKrw', width: 20 },
                        { header: 'Monthly Rent', key: 'monthlyRent', width: 20 },
                        { header: 'Monthly Rent / py', key: 'monthlyRentPerPy', width: 20 },
                        { header: 'Management Fee', key: 'monthlyManagementFee', width: 20 },
                        { header: 'Management Fee / py', key: 'monthlyManagementPerPy', width: 20 },
                        { header: 'Increase Cond. (Deposit)', key: 'incCondDeposit', width: 25 },
                        { header: 'Increase Cond. (Rent)', key: 'incCondRent', width: 25 },
                        { header: 'Increase Cond. (Mgmt)', key: 'incCondMgmt', width: 25 },
                        { header: 'Rent Free', key: 'rentFree', width: 20 },
                        { header: 'Fit Out', key: 'fitOut', width: 20 },
                ];

                properties.forEach(p => {
                        const no = propertyNoMap.get(p.id);
                        if (p.floor && p.floor.length > 0) {
                                p.floor.forEach(f => {
                                        if (f.floorPartial && f.floorPartial.length > 0) {
                                                f.floorPartial.forEach(fp => {
                                                        sheetFloorPartial.addRow({
                                                                no: no,
                                                                propertyName: p.name,
                                                                floor: f.floor,
                                                                unit: fp.unitNumber,
                                                                tenant: fp.tenant,
                                                                leaseAreaSqm: fp.leaseAreaSqm,
                                                                leaseAreaPy: fp.leaseAreaPy,
                                                                use: fp.tenantUse,
                                                                tenantEquipment: fp.tenantEquipment ? 'Yes' : 'No',
                                                                leaseStartDate: fp.leaseStartDate ? new Date(fp.leaseStartDate).toLocaleDateString() : '',
                                                                leaseEndDate: fp.leaseEndDate ? new Date(fp.leaseEndDate).toLocaleDateString() : '',
                                                                depositKrw: fp.depositKrw,
                                                                monthlyRent: fp.monthlyRent,
                                                                monthlyRentPerPy: fp.monthlyRentPerPy,
                                                                monthlyManagementFee: fp.monthlyManagementFee,
                                                                monthlyManagementPerPy: fp.monthlyManagementPerPy,
                                                                incCondDeposit: fp.increaseConditionsForDeposit,
                                                                incCondRent: fp.increaseConditionsForRent,
                                                                incCondMgmt: fp.increaseConditionsForManagementFee,
                                                                rentFree: fp.rentFree,
                                                                fitOut: fp.fitOut,
                                                        });
                                                });
                                        }
                                });
                        }
                });
                applyHeaderStyle(sheetFloorPartial);

                // --- 4. Sale Info Sheet ---
                const sheetSale = workbook.addWorksheet('Sale Info');
                sheetSale.columns = [
                        { header: 'No.', key: 'no', width: 8 },
                        { header: 'Property Name', key: 'propertyName', width: 35 },
                        { header: 'Transaction Date', key: 'executionDate', width: 15 },
                        { header: 'Year', key: 'year', width: 10 },
                        { header: 'Quarter', key: 'quarter', width: 10 },
                        { header: 'Sale Type', key: 'saleType', width: 15 },
                        { header: 'GFA (sqm)', key: 'gfaSqm', width: 15 },
                        { header: 'NFA (sqm)', key: 'nfaSqm', width: 15 },
                        { header: 'Price (KRW)', key: 'priceKrw', width: 20 },
                        { header: 'Price per GFA', key: 'pricePerGfa', width: 20 },
                        { header: 'Price per NFA', key: 'pricePerNfa', width: 20 },
                        { header: 'Buyer', key: 'buyer', width: 30 },
                        { header: 'Seller', key: 'seller', width: 30 },
                        { header: 'Cap Rate', key: 'estCapRate', width: 10 },
                        { header: 'Discount Rate', key: 'estDiscountRate', width: 10 },
                        { header: 'Remarks', key: 'remarks', width: 30 },
                ];

                properties.forEach(p => {
                        const no = propertyNoMap.get(p.id);
                        if (p.transaction && p.transaction.length > 0) {
                                p.transaction.forEach(t => {
                                        if (t.type === 'SALE' && t.sale) {
                                                sheetSale.addRow({
                                                        no: no,
                                                        propertyName: p.name,
                                                        executionDate: t.executionDate ? new Date(t.executionDate).toLocaleDateString() : '',
                                                        year: t.year,
                                                        quarter: t.quarter,
                                                        saleType: t.sale.saleType,
                                                        gfaSqm: t.sale.gfaSqm,
                                                        nfaSqm: t.sale.nfaSqm,
                                                        priceKrw: t.sale.priceKrw,
                                                        pricePerGfa: t.sale.pricePerGfa,
                                                        pricePerNfa: t.sale.pricePerNfa,
                                                        buyer: t.sale.buyer,
                                                        seller: t.sale.seller,
                                                        estCapRate: t.sale.estCapRate,
                                                        estDiscountRate: t.sale.estDiscountRate,
                                                        remarks: t.sale.remarks,
                                                });
                                        }
                                });
                        }
                });
                applyHeaderStyle(sheetSale);

                // --- 5. Lease Info Sheet ---
                const sheetLease = workbook.addWorksheet('Lease Info');
                sheetLease.columns = [
                        { header: 'No.', key: 'no', width: 8 },
                        { header: 'Property Name', key: 'propertyName', width: 35 },
                        { header: 'Transaction Date', key: 'executionDate', width: 15 },
                        { header: 'Year', key: 'year', width: 10 },
                        { header: 'Quarter', key: 'quarter', width: 10 },
                        { header: 'Lease Type', key: 'leaseType', width: 15 },
                        { header: 'Floor', key: 'floor', width: 10 },
                        { header: 'Unit', key: 'unit', width: 10 },
                        { header: 'Lease Start', key: 'leaseStartDate', width: 15 },
                        { header: 'Lease End', key: 'leaseEndDate', width: 15 },
                        { header: 'GFA (sqm)', key: 'gfaSqm', width: 15 },
                        { header: 'GFA (py)', key: 'gfaPy', width: 15 },
                        { header: 'NFA (sqm)', key: 'nfaSqm', width: 15 },
                        { header: 'NFA (py)', key: 'nfaPy', width: 15 },
                        { header: 'Eff. Ratio', key: 'effRatio', width: 10 },
                        { header: 'Monthly Rent', key: 'monthlyRent', width: 20 },
                        { header: 'Monthly CAMF', key: 'monthlyCamf', width: 20 },
                        { header: 'Deposit', key: 'deposit', width: 20 },
                        { header: 'Rent / py', key: 'rentMonthlyPy', width: 15 },
                        { header: 'CAMF / py', key: 'camfMonthlyPy', width: 15 },
                        { header: 'Deposit / py', key: 'depositPy', width: 15 },
                        { header: 'IOD', key: 'iod', width: 10 },
                        { header: 'GDM', key: 'gdm', width: 10 },
                        { header: 'NOC', key: 'noc', width: 15 },
                        { header: 'Lease Term (yr)', key: 'leaseTermYear', width: 15 },
                        { header: 'Rent Free Type', key: 'rentFreeType', width: 15 },
                        { header: 'Rent Free (mth)', key: 'rentFreeMonth', width: 15 },
                        { header: 'Eff. NOC', key: 'effectiveNoc', width: 15 },
                        { header: 'Fit Out', key: 'fitOut', width: 15 },
                        { header: 'TI Amount (KRW)', key: 'tiAmountKrw', width: 20 },
                        { header: 'TI Amount / NFA py', key: 'tiAmountNfaPy', width: 20 },
                        { header: 'Total Free Rent (mth)', key: 'totalFreeRentPeriodMonth', width: 20 },
                        { header: 'Total Occupying (yr)', key: 'totalOccupyingPeriodYear', width: 20 },
                        { header: 'Total Free Rent Occupying (yr)', key: 'totalFreeRentOccupyingYear', width: 25 },
                        { header: 'Cash Support / GFA', key: 'monthlyCashSupportGfa', width: 20 },
                        { header: 'All-in Eff. Rent / py', key: 'allInEffectiveRentMonthlyPy', width: 20 },
                        { header: 'All-in NOC', key: 'allInNoc', width: 15 },
                ];

                properties.forEach(p => {
                        const no = propertyNoMap.get(p.id);
                        if (p.transaction && p.transaction.length > 0) {
                                p.transaction.forEach(t => {
                                        if (t.type === 'LEASE' && t.lease) {
                                                sheetLease.addRow({
                                                        no: no,
                                                        propertyName: p.name,
                                                        executionDate: t.executionDate ? new Date(t.executionDate).toLocaleDateString() : '',
                                                        year: t.year,
                                                        quarter: t.quarter,
                                                        leaseType: t.lease.leaseType,
                                                        floor: t.lease.floor,
                                                        unit: t.lease.unit,
                                                        leaseStartDate: t.lease.leaseStartDate ? new Date(t.lease.leaseStartDate).toLocaleDateString() : '',
                                                        leaseEndDate: t.lease.leaseEndDate ? new Date(t.lease.leaseEndDate).toLocaleDateString() : '',
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
                                                        effectiveNoc: t.lease.effectiveNoc,
                                                        fitOut: t.lease.fitOut,
                                                        tiAmountKrw: t.lease.tiAmountKrw,
                                                        tiAmountNfaPy: t.lease.tiAmountNfaPy,
                                                        totalFreeRentPeriodMonth: t.lease.totalFreeRentPeriodMonth,
                                                        totalOccupyingPeriodYear: t.lease.totalOccupyingPeriodYear,
                                                        totalFreeRentOccupyingYear: t.lease.totalFreeRentOccupyingYear,
                                                        monthlyCashSupportGfa: t.lease.monthlyCashSupportGfa,
                                                        allInEffectiveRentMonthlyPy: t.lease.allInEffectiveRentMonthlyPy,
                                                        allInNoc: t.lease.allInNoc,
                                                });
                                        }
                                });
                        }
                });
                applyHeaderStyle(sheetLease);

                // Generate and Download
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `Property_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
        };

        return {
                downloadPropertyExcel
        };
};
