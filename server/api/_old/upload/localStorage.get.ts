
export default defineEventHandler(async (event) => {
        
        // 핸들러 이벤트에서 쿼리를 가져옴 
        let query = getQuery(event);

        // 원본이미지 확장자         
        let strArry = query.fileType?.toString().split('/') as []
        let originExt = strArry.pop()+'' as string

        // 현재 시간을 기반으로 고유한 파일 키 생성
        const timestamp = new Date().getTime();
        const key = `${timestamp}_${query.fileUuid}.${originExt}`;

        // Local에 업로드될 파일의 속성을 정의하는 매개 변수 객체 생성
        const params = {
                Key: key,
                ContentType: query.fileType
        } as any;

        
        // 미리 서명 된 URL을 생성
        const uploadedUrl = {}

        // 생성된 미리 서명 된 URL을 반환
        return {uploadUrl:uploadedUrl, fileName:key};
})