// composables/useFormat.ts

export const PY_TO_SQM_RATIO = 3.305785; // 1평 = 약 3.305785 ㎡
export const SQM_TO_PY_RATIO = 1 / PY_TO_SQM_RATIO; // 1㎡ = 약 0.3025평

export const useFormat = () => {

        /**
         * 숫자를 천 단위 콤마 포맷 문자열로 변환
         * @param value 숫자 또는 문자열
         * @param decimals 소수점 자릿수 (기본값 0)
         */
        const numberFormat = (value: number | string | null | undefined, decimals: number = 0): string => {
                if (value === null || value === undefined || value === '') return '';

                const num = Number(value);
                if (isNaN(num)) return '';

                return num.toLocaleString('ko-KR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: decimals
                });
        };

        /**
         * 입력 필드용 숫자 처리 (Floor.vue 등에서 사용)
         * 입력값(String)을 받아 -> { 클렌징된 값, 포맷된 값(콤마), 실제 숫자값(DB용) } 반환
         */
        const processNumberInput = (rawValue: string, isDecimal: boolean, decimalPlaces: number = 0) => {
                // 1. 숫자와 소수점만 남기기
                let cleanedValue = rawValue.replace(/[^0-9.]/g, '');

                // 2. 소수점 처리
                if (isDecimal) {
                        const parts = cleanedValue.split('.');
                        if (parts.length > 2) {
                                // 소수점이 여러 개면 첫 번째만 유지
                                cleanedValue = parts[0] + '.' + parts.slice(1).join('');
                        }
                        if (parts.length > 1) {
                                // 소수점 자릿수 제한
                                cleanedValue = parts[0] + '.' + parts[1].slice(0, decimalPlaces);
                        }
                } else {
                        // 정수형이면 소수점 제거
                        cleanedValue = cleanedValue.replace(/\./g, '');
                }

                // 3. 실제 저장될 숫자 값 (null 처리 포함)
                let numericValue: number | null = null;
                if (cleanedValue !== '' && cleanedValue !== '.') {
                        numericValue = Number(cleanedValue);
                }

                // 4. 화면 표시용 값 (입력 중에는 소수점을 유지해야 함)
                let formattedValue = '';
                if (cleanedValue !== '') {
                        if (cleanedValue.endsWith('.')) {
                                // "123." 입력 시 콤마 추가 + 소수점 유지
                                formattedValue = Number(cleanedValue.slice(0, -1)).toLocaleString() + '.';
                        } else if (cleanedValue === '.') {
                                formattedValue = '0.';
                        } else {
                                // 소수점이 포함된 경우와 아닌 경우 모두 처리
                                const parts = cleanedValue.split('.');
                                parts[0] = Number(parts[0]).toLocaleString();
                                formattedValue = parts.join('.');
                        }
                }

                return {
                        cleanedValue,
                        formattedValue,
                        numericValue
                };
        };

        /**
         * 평(Py) 값 계산 (㎡ -> Py)
         */
        const calculatePyValue = (sqmValue: number): number => {
                if (!sqmValue || isNaN(sqmValue)) return 0;
                const pyResult = sqmValue * SQM_TO_PY_RATIO;
                return parseFloat(pyResult.toFixed(2));
        };

        /**
         * 날짜 포맷 (YYYY-MM-DD) - Input type="date" 또는 표시용
         */
        const formatDate = (date: Date | string | null | undefined): string => {
                if (!date) return '';
                try {
                        const d = new Date(date);
                        if (isNaN(d.getTime())) return '';
                        return d.toISOString().split('T')[0];
                } catch (e) {
                        return '';
                }
        };

        /**
         * 화면 표시용 날짜 포맷 (YYYY.MM.DD)
         */
        const formatDateForDisplay = (date: Date | string | null | undefined): string => {
                if (!date) return '-';
                try {
                        const d = new Date(date);
                        if (isNaN(d.getTime())) return '-';
                        // 한국 로케일 기준 (YYYY. MM. DD.) -> YYYY.MM.DD 로 변환
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        return `${year}.${month}.${day}`;
                } catch (e) {
                        return '-';
                }
        };

        /**
         * 입력 필드에서 YYYY-MM-DD 형식으로 자동 하이픈 추가
         */
        const formatDateInput = (event: Event, dataObject: any, fieldName: string) => {
                const input = event.target as HTMLInputElement;
                let val = input.value.replace(/\D/g, ''); // 숫자만 남김

                if (val.length > 8) val = val.substring(0, 8);

                let formatted = '';
                if (val.length > 4) {
                        formatted += val.substring(0, 4) + '-';
                        if (val.length > 6) {
                                formatted += val.substring(4, 6) + '-' + val.substring(6);
                        } else {
                                formatted += val.substring(4);
                        }
                } else {
                        formatted = val;
                }

                // 화면 업데이트
                input.value = formatted;

                // 데이터 객체 업데이트
                const displayField = fieldName + 'Display';
                if (displayField in dataObject) {
                        dataObject[displayField] = formatted;
                }

                // 유효한 날짜(8자리)가 완성되었을 때만 실제 필드에 저장
                if (val.length === 8) {
                        const year = parseInt(val.substring(0, 4));
                        const month = parseInt(val.substring(4, 6));
                        const day = parseInt(val.substring(6, 8));
                        if (month > 0 && month <= 12 && day > 0 && day <= 31) {
                                dataObject[fieldName] = formatted;
                        } else {
                                dataObject[fieldName] = null;
                        }
                } else {
                        dataObject[fieldName] = null;
                }
        };

        /**
         * Null/Undefined/Empty 값에 대한 기본값 표시
         */
        const displayValue = (value: any, fallback: string = '-'): string => {
                if (value === null || value === undefined || value === '') return fallback;
                return String(value);
        };

        // 💡 [추가] 날짜를 'YYYY-MM-DD' 문자열로 반환하거나 빈 문자열 반환
        const toDateStringOrEmpty = (dateInput: Date | string | null | undefined): string => {
                if (!dateInput) return '';
                try {
                        const date = new Date(dateInput);
                        if (isNaN(date.getTime())) return '';
                        return date.toISOString().split('T')[0];
                } catch {
                        return '';
                }
        };

        // 💡 [추가] 날짜 문자열(YYYY-MM-DD)로부터 연도(Year)와 분기(Quarter) 계산
        const calculateYearAndQuarter = (dateString: string) => {
                if (!dateString) return { year: '', quarter: '' };
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return { year: '', quarter: '' };

                const year = date.getFullYear().toString();
                const month = date.getMonth() + 1;
                const q = Math.ceil(month / 3);

                return { year, quarter: `Q${q}` };
        };

        /**
         * 💡 [수정] 썸네일 URL 반환 함수 (Client-Side Calculation)
         * - API를 통하지 않고, URL 규칙(thumb_ 접두어)을 이용해 직접 썸네일 주소를 만듭니다.
         * - 이렇게 하면 Node.js 서버 부하가 사라지고 로딩이 매우 빨라집니다.
         */
        const getThumbnailUrl = (originalUrl: string | null | undefined): string => {
                if (!originalUrl) return '/images/placeholder.jpg';

                // 1. 이미 썸네일이거나 로컬 이미지면 그대로 반환
                if (originalUrl.includes('/thumb_') || originalUrl.startsWith('/images/')) {
                        return originalUrl;
                }

                // 2. URL 확장자 검사 (이미지가 아니면 원본 반환)
                const ext = originalUrl.split('.').pop()?.toLowerCase();
                if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
                        return originalUrl;
                }

                // 3. URL 경로 파싱 및 "thumb_" 주입
                try {
                        // 예: https://minio.com/bucket/2023/image.jpg
                        const parts = originalUrl.split('/');
                        const fileName = parts.pop(); // image.jpg

                        if (!fileName) return originalUrl;

                        const thumbName = `thumb_${fileName}`; // thumb_image.jpg

                        // https://minio.com/bucket/2023/thumb_image.jpg
                        return [...parts, thumbName].join('/');

                } catch (e) {
                        return originalUrl;
                }
        };

        return {
                numberFormat,
                processNumberInput,
                calculatePyValue,
                formatDate,
                formatDateForDisplay,
                formatDateInput,
                displayValue,
                toDateStringOrEmpty,
                calculateYearAndQuarter,
                getThumbnailUrl,
        };
};