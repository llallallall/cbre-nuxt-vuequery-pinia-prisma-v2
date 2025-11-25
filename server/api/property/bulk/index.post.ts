import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import ExcelJS from 'exceljs';

export default defineEventHandler(async (event) => {
        const formData = await readMultipartFormData(event);
        if (!formData || formData.length === 0) {
                throw createError({ statusCode: 400, statusMessage: 'No file uploaded.' });
        }

        const file = formData.find(item => item.name === 'file');
        if (!file || !file.data) {
                throw createError({ statusCode: 400, statusMessage: 'File data is missing.' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.data as any);

        const resultLog: string[] = [];
        const refIdMap = new Map<string, string>(); // Ref_ID -> Property ID
        const transRefIdMap = new Map<string, string>(); // Ref_ID -> Transaction ID

        // Helper to get sheet data as array of objects
        const getSheetData = (sheetName: string) => {
                const sheet = workbook.getWorksheet(sheetName);
                if (!sheet) return [];

                const data: any[] = [];
                let headers: string[] = [];

                sheet.eachRow((row, rowNumber) => {
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
                                if (hasData) data.push(rowData);
                        }
                });
                return data;
        };

        try {
                await prisma.$transaction(async (tx) => {
                        // 1. General Info (Property)
                        const properties = getSheetData('General Info');
                        for (const row of properties) {
                                if (!row['Ref_ID'] || !row['Property Name'] || !row['Sector ID']) continue;

                                const property = await tx.property.create({
                                        data: {
                                                name: row['Property Name'],
                                                sector_id: row['Sector ID'],
                                                // Add other fields as needed mapping from row
                                        }
                                });
                                refIdMap.set(row['Ref_ID'].toString(), property.id);
                        }
                        resultLog.push(`Imported ${properties.length} Properties.`);

                        // 2. Warehouse
                        const warehouses = getSheetData('Warehouse');
                        for (const row of warehouses) {
                                const propId = refIdMap.get(row['Property_Ref_ID']?.toString());
                                if (propId) {
                                        await tx.warehouse.create({
                                                data: {
                                                        property_id: propId,
                                                        temperature_type: row['Temperature Type'], // Ensure Enum matches
                                                        ratio: row['Ratio'] ? parseFloat(row['Ratio']) : null,
                                                }
                                        });
                                }
                        }
                        resultLog.push(`Imported ${warehouses.length} Warehouse records.`);

                        // 3. History
                        const histories = getSheetData('History');
                        for (const row of histories) {
                                const propId = refIdMap.get(row['Property_Ref_ID']?.toString());
                                if (propId) {
                                        await tx.history.create({
                                                data: {
                                                        property_id: propId,
                                                        year: row['Year']?.toString(),
                                                        type: row['Type'], // Ensure Enum matches
                                                }
                                        });
                                }
                        }
                        resultLog.push(`Imported ${histories.length} History records.`);

                        // 4. Floor
                        const floors = getSheetData('Floor');
                        for (const row of floors) {
                                const propId = refIdMap.get(row['Property_Ref_ID']?.toString());
                                if (propId) {
                                        await tx.floor.create({
                                                data: {
                                                        property_id: propId,
                                                        floor: parseInt(row['Floor']),
                                                        type: row['Type'], // UPPER / BASEMENT
                                                        total_area_sqm: row['Total Area (sqm)'] ? parseFloat(row['Total Area (sqm)']) : null,
                                                        // Map other fields
                                                }
                                        });
                                }
                        }
                        resultLog.push(`Imported ${floors.length} Floor records.`);

                        // 5. Floor Partial
                        const floorPartials = getSheetData('Floor Partial');
                        for (const row of floorPartials) {
                                const propId = refIdMap.get(row['Property_Ref_ID']?.toString());
                                if (propId) {
                                        // Find parent floor
                                        const floor = await tx.floor.findUnique({
                                                where: {
                                                        property_id_type_floor: {
                                                                property_id: propId,
                                                                type: row['Type'],
                                                                floor: parseInt(row['Floor'])
                                                        }
                                                }
                                        });

                                        if (floor) {
                                                await tx.floorPartial.create({
                                                        data: {
                                                                floor_id: floor.id,
                                                                unit_number: row['Unit Number']?.toString(),
                                                                tenant: row['Tenant'],
                                                                // Map other fields
                                                        }
                                                });
                                        }
                                }
                        }
                        resultLog.push(`Imported ${floorPartials.length} Floor Partial records.`);

                        // 6. Transaction
                        const transactions = getSheetData('Transaction');
                        for (const row of transactions) {
                                const propId = refIdMap.get(row['Property_Ref_ID']?.toString());
                                if (propId && row['Ref_ID']) {
                                        const transaction = await tx.transaction.create({
                                                data: {
                                                        property_id: propId,
                                                        type: row['Type'], // SALE / LEASE
                                                        year: row['Year']?.toString(),
                                                        quarter: row['Quarter']?.toString(),
                                                        execution_date: row['Execution Date'] ? new Date(row['Execution Date']) : new Date(),
                                                }
                                        });
                                        transRefIdMap.set(row['Ref_ID'].toString(), transaction.id);
                                }
                        }
                        resultLog.push(`Imported ${transactions.length} Transactions.`);

                        // 7. Sale
                        const sales = getSheetData('Sale');
                        for (const row of sales) {
                                const transId = transRefIdMap.get(row['Transaction_Ref_ID']?.toString());
                                if (transId) {
                                        await tx.sale.create({
                                                data: {
                                                        transaction_id: transId,
                                                        sale_type: row['Sale Type'], // ENBLOC / PARTIAL
                                                        price_krw: row['Price (KRW)'] ? parseInt(row['Price (KRW)']) : null,
                                                        // Map other fields
                                                }
                                        });
                                }
                        }
                        resultLog.push(`Imported ${sales.length} Sale records.`);

                        // 8. Lease
                        const leases = getSheetData('Lease');
                        for (const row of leases) {
                                const transId = transRefIdMap.get(row['Transaction_Ref_ID']?.toString());
                                if (transId) {
                                        await tx.lease.create({
                                                data: {
                                                        transaction_id: transId,
                                                        lease_type: row['Lease Type'], // ASKING / ACTUAL
                                                        monthly_rent: row['Monthly Rent'] ? parseInt(row['Monthly Rent']) : null,
                                                        // Map other fields
                                                }
                                        });
                                }
                        }
                        resultLog.push(`Imported ${leases.length} Lease records.`);
                });

                return {
                        status: 'success',
                        message: 'Bulk upload completed successfully.',
                        log: resultLog
                };

        } catch (error: any) {
                console.error('Bulk Upload Error:', error);
                throw createError({ statusCode: 500, statusMessage: `Import failed: ${error.message}` });
        }
});
