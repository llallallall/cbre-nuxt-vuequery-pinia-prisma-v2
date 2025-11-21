// utils/transformer.ts

import type { PropertyType } from '~/types/property.type';

/**
 * @description 문자열, null, undefined 값을 받아 Date 객체 또는 null로 변환합니다.
 */
export const deserializeDate = (value: string | Date | null | undefined): Date | null => {
        if (!value) return null;
        // 이미 Date 객체라면 그대로 반환
        if (value instanceof Date) return value;

        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
}

/**
 * @description 표준 Timestamp 필드 (createdAt, updatedAt)를 변환하는 헬퍼 함수
 */
const transformTimestamps = (obj: any) => {
        if (!obj) return;
        if (obj.createdAt) obj.createdAt = deserializeDate(obj.createdAt);
        if (obj.updatedAt) obj.updatedAt = deserializeDate(obj.updatedAt);
};

/**
 * @description API 응답(JSON)을 순회하며 날짜 문자열을 실제 Date 객체로 변환합니다.
 * PropertyType 구조 전체를 커버합니다.
 */
export const transformPropertyResponse = (data: any): PropertyType => {
        if (!data) return data;

        // 1. Property Root (기본 정보)
        transformTimestamps(data);

        // 2. 1:1 관계 (단일 객체)
        // Location, Scale, Facility, Accessibility, Profitability
        const singleRelations = ['location', 'scale', 'facility', 'accessibility', 'profitability'];
        singleRelations.forEach(key => {
                if (data[key]) {
                        transformTimestamps(data[key]);
                }
        });

        // 3. 1:N 관계 (단순 리스트)
        // Warehouse, History, Files
        const listRelations = ['warehouse', 'history', 'propertyImageFile', 'propertyBrochureFile', 'floorPlanFile'];
        listRelations.forEach(key => {
                if (data[key] && Array.isArray(data[key])) {
                        data[key].forEach((item: any) => transformTimestamps(item));
                }
        });

        // 4. Floor & FloorPartial (중첩 구조)
        if (data.floor && Array.isArray(data.floor)) {
                data.floor.forEach((f: any) => {
                        transformTimestamps(f); // Floor: createdAt, updatedAt

                        if (f.floorPartial && Array.isArray(f.floorPartial)) {
                                f.floorPartial.forEach((fp: any) => {
                                        transformTimestamps(fp); // FloorPartial: createdAt, updatedAt

                                        // FloorPartial 고유 날짜 필드
                                        fp.leaseStartDate = deserializeDate(fp.leaseStartDate);
                                        fp.leaseEndDate = deserializeDate(fp.leaseEndDate);
                                });
                        }
                });
        }

        // 5. Transaction & Sale/Lease (중첩 구조)
        if (data.transaction && Array.isArray(data.transaction)) {
                data.transaction.forEach((t: any) => {
                        transformTimestamps(t); // Transaction: createdAt, updatedAt

                        // Transaction 고유 날짜 필드
                        t.executionDate = deserializeDate(t.executionDate);

                        // Sale Detail
                        if (t.sale) {
                                transformTimestamps(t.sale);
                        }

                        // Lease Detail
                        if (t.lease) {
                                transformTimestamps(t.lease);

                                // Lease 고유 날짜 필드
                                t.lease.leaseStartDate = deserializeDate(t.lease.leaseStartDate);
                                t.lease.leaseEndDate = deserializeDate(t.lease.leaseEndDate);
                        }
                });
        }

        return data as PropertyType;
};