// /composables/useFormat.ts

import type { FloorPartialForm } from '~/types/asset.type'; // formatDateInput을 위해 임포트

/**
 * =======================================================
 * 0. 상수 정의 (신규 추가)
 * =======================================================
 */
export const PY_TO_SQM_RATIO = 3.305785; // 1평 = 약 3.305785 ㎡
export const SQM_TO_PY_RATIO = 1 / PY_TO_SQM_RATIO; // 1㎡ = 약 0.3025평

/**
 * =======================================================
 * 1. 텍스트 및 숫자 포맷팅 (기존 함수)
 * =======================================================
 */

/**
 * 텍스트 처리 함수
 */
export function truncateWords(str: string, count: number): string { //
        if (!str) return str;
        return str.split(" ").slice(0, count).join(" ")
}

/**
 * 정수 천 단위 콤마 포맷팅 (numberFormat으로 대체 권장)
 * @deprecated
 */
export function thousandsFormat(value: any): string { //
        if (!value) return '0';
        const num = parseInt(value);
        if (isNaN(num)) return String(value).replace(/[^0-9.]/g, '');

        let s2 = num.toString();
        // insert commas every 3 digits from the right
        for (var i = s2.length - 3; i > 0; i -= 3) {
                s2 = s2.slice(0, i) + ',' + s2.slice(i);
        }
        return s2;
}

/**
 * 숫자 필드를 포맷팅하고 입력값을 클리닝하는 핵심 함수 (기존)
 */
export function numberFormat(value: any, numFix: number): string { //
        let s1 = String(value).replace(/,/g, '').trim();

        if (!s1 || s1 === '.') return '';

        s1 = s1.replace(/[^0-9.]/g, '');

        var d = s1.indexOf('.');
        var s2 = d === -1 ? s1 : s1.slice(0, d); // 정수 부분

        for (var i = s2.length - 3; i > 0; i -= 3) {
                s2 = s2.slice(0, i) + ',' + s2.slice(i);
        }

        if (d !== -1) {
                let fractionalPart = s1.slice(d + 1);

                if (fractionalPart.length > numFix) {
                        fractionalPart = fractionalPart.slice(0, numFix);
                }
                s2 += '.' + fractionalPart;
        }

        if (s2 === '0' && s1 !== '0') return s1;

        return s2;
}

/**
 * @description 포맷된 문자열을 순수 숫자 (number | null)로 변환합니다.
 * @param rawValue 입력 필드에서 받은 원본 문자열 (콤마 포함 가능)
 * @param isDecimal 소수점을 허용할지 여부 (기본값: false). LeaseDetailModal.vue에서 true로 전달됩니다.
 */
export function parseNumber(rawValue: string | number | null | undefined, isDecimal: boolean = false): number | null {
        if (rawValue === null || rawValue === undefined || rawValue === '') {
                return null;
        }

        // 문자열에서 콤마(,)를 제거합니다.
        let cleanedValue = String(rawValue).replace(/,/g, '').trim();

        // 숫자가 아니거나 비어있으면 null 반환
        if (!cleanedValue || isNaN(Number(cleanedValue))) {
                return null;
        }

        // isDecimal 값에 따라 Float 또는 Int로 변환하여 반환
        return isDecimal ? parseFloat(cleanedValue) : parseInt(cleanedValue);
}
/**
 * =======================================================
 * 2. 신규 추출 함수 (From Floor.vue)
 * =======================================================
 */

/**
 * 💡 [신규] 숫자 입력 처리의 핵심 로직 (Floor.vue에서 추출)
 * 입력값을 받아 클리닝/포맷팅/파싱 결과를 반환합니다.
 */
export function processNumberInput(
        rawValue: string,
        isDecimal: boolean,
        decimalPlaces: number = 0
) {
        // 1. 쉼표(,)와 숫자/소수점 외 문자 제거
        let cleanedValue = rawValue.replace(/[^0-9.]/g, ''); //

        // 2. 소수점 중복 제거 및 자릿수 제한
        if (isDecimal) { //
                const parts = cleanedValue.split('.');
                if (parts.length > 2) {
                        cleanedValue = parts[0] + '.' + parts.slice(1).join(''); //
                }
                if (parts.length > 1 && parts[1].length > decimalPlaces) {
                        cleanedValue = parts[0] + '.' + parts[1].slice(0, decimalPlaces); //
                }
        } else {
                cleanedValue = cleanedValue.replace(/\./g, ''); //
        }

        // 3. 포맷팅
        let formattedValue = '';
        if (cleanedValue !== '') {
                formattedValue = numberFormat(cleanedValue, decimalPlaces); //
                if (cleanedValue.endsWith('.')) {
                        formattedValue += '.'; //
                }
        }

        // 4. 모델 값 파싱
        let numericValue: number | null = null;
        const isCompleteNumber = cleanedValue !== '' && cleanedValue !== '.' && !cleanedValue.endsWith('.'); //

        if (isCompleteNumber) {
                numericValue = Number(cleanedValue);
                if (isNaN(numericValue as number)) {
                        numericValue = null; //
                }
        }

        // 3가지 상태 반환
        return {
                cleanedValue,   // 콤마 없고, 자릿수 제한된 값 (예: "1234.56")
                formattedValue, // 콤마 포함된 표시 값 (예: "1,234.56")
                numericValue    // 모델 저장 값 (예: 1234.56 또는 null)
        };
}

/**
 * 💡 [신규] Py 값 계산 (Floor.vue에서 추출)
 */
export function calculatePyValue(sqmValue: number): number { //
        if (sqmValue === null || isNaN(sqmValue)) return 0;
        const pyResult = sqmValue / PY_TO_SQM_RATIO;
        return parseFloat(pyResult.toFixed(2));
}

/**
 * 💡 [신규] 날짜 값을 YYYY-MM-DD 문자열로 포맷 (Floor.vue에서 추출)
 */
export function formatDate(date: Date | string | null): string { //
        if (!date) return '';
        try {
                const dateObj = date instanceof Date ? date : new Date(date);
                if (isNaN(dateObj.getTime())) return '';
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
        } catch (e) {
                return '';
        }
}

const calculateYearAndQuarter = (dateString: string) => {
        if (typeof dateString !== 'string' || !dateString) {
                return { year: '', quarter: '' };
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
                return { year: '', quarter: '' };
        }
        const year = date.getFullYear().toString();
        const month = date.getMonth() + 1;

        let quarter = '';
        if (month >= 1 && month <= 3) {
                quarter = 'Q1';
        } else if (month >= 4 && month <= 6) {
                quarter = 'Q2';
        } else if (month >= 7 && month <= 9) {
                quarter = 'Q3';
        } else if (month >= 10 && month <= 12) {
                quarter = 'Q4';
        }
        return { year, quarter };
};

/**
 * 💡 [신규] 날짜 입력 필드 자동 하이픈 처리 (Floor.vue에서 추출)
 * dataObject 타입을 any로 변경하여 공통 사용
 */
export function formatDateInput(event: Event, dataObject: any, fieldName: string) { //
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/[^0-9]/g, '');

        if (value.length > 8) {
                value = value.substring(0, 8);
        }

        let formattedDisplay = value;
        if (value.length > 4) {
                formattedDisplay = value.substring(0, 4) + '-' + value.substring(4);
        }
        if (value.length > 6) {
                formattedDisplay = formattedDisplay.substring(0, 7) + '-' + value.substring(6);
        }

        const displayField = (fieldName + 'Display');
        dataObject[displayField] = formattedDisplay;

        if (value.length === 8) {
                dataObject[fieldName] = formattedDisplay;
        } else if (value.length === 0) {
                dataObject[fieldName] = null;
        } else {
                dataObject[fieldName] = null;
        }
}

/**
 * Date 객체나 유효한 날짜 문자열을 'YYYY-MM-DD' 형식의 문자열로 변환합니다.
 * 유효하지 않은 값이면 빈 문자열('')을 반환합니다.
 */
export function toDateStringOrEmpty(value: Date | string | null | undefined): string {
        if (!value) {
                return '';
        }

        let date: Date;

        if (value instanceof Date) {
                date = value;
        } else {
                // 날짜 문자열이 'YYYY-MM-DD' 형식이 아닐 수 있으므로 new Date()를 사용
                date = new Date(value);
        }

        // 유효하지 않은 날짜(Invalid Date)인 경우 빈 문자열 반환
        if (isNaN(date.getTime())) {
                return '';
        }

        // YYYY-MM-DD 형식으로 변환
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
}


/**
 * =======================================================
 * 3. 기존 기타 함수
 * =======================================================
 */

export function formatLeaseDate(dateString: string) { //
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('default', { dateStyle: 'long' }).format(date);
}

export function getFloorDisplayNumber(any: any) { //
        return true;
}


/**
 * =======================================================
 * 4. 컴포저블 반환 객체 (수정)
 * =======================================================
 */

/**
 * UI 화면 표시용 날짜 포맷 (YYYY.MM.DD)
 * @param date Date 객체, ISO 문자열 또는 null/undefined
 */
export function formatDateForDisplay(date: Date | string | null | undefined): string {
        if (!date) return '-';
        // ... (실제 구현 로직: YYYY.MM.DD 형식으로 변환)
        // 예: '2025-11-16' -> '2025.11.16'
        let d = date;
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return date.replace(/-/g, '.');
        }
        // ... (Date 객체 처리 로직)
        return '-'; // 유효하지 않은 날짜인 경우
}

/**
 * 값이 유효하지 않을 때 (null, undefined, 빈 문자열) 기본값을 반환하는 범용 함수
 * @param value 확인할 값
 * @param defaultValue 값이 유효하지 않을 때 반환할 값 (기본값: '-')
 */
export function displayValue<T>(value: T | null | undefined, defaultValue: string = '-'): string | T {
        if (value === null || value === undefined || value === '') {
                return defaultValue;
        }
        return value;
}



/**
 * 컴포저블로 묶어서 반환
 */
export const useFormat = () => {
        return {
                truncateWords,
                thousandsFormat,
                numberFormat,
                parseNumber,
                formatLeaseDate,
                getFloorDisplayNumber,

                // --- 신규 추가 ---
                PY_TO_SQM_RATIO,
                SQM_TO_PY_RATIO,
                calculatePyValue,
                formatDate,
                formatDateInput,
                processNumberInput,
                toDateStringOrEmpty,

                formatDateForDisplay,
                displayValue,
                calculateYearAndQuarter

        };
};
