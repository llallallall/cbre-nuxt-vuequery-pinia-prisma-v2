// AWS SDK 및 S3 클라이언트와 PutObjectCommand를 가져옴
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
        // NUXT 런타임 환경 구성에서 AWS 액세스 키, 시크릿 액세스 키 및 REGION을 가져옴
        const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = useRuntimeConfig();

        // console.log(AWS_ACCESS_KEY_ID);
        // console.log(AWS_SECRET_ACCESS_KEY);
        // console.log(AWS_REGION);
        // console.log(AWS_BUCKET_NAME);

        // 내 S3 버킷을 지정한 S3 클라이언트 객체 생성
        // AWS SDK에서 제공하는 S3 서비스를 이용하기 위해 사용하는 객체입니다. 이 객체를 생성하면, S3에 파일을 업로드하거나 다운로드, 삭제 등의 작업을 수행할 수 있습니다. 
        // S3 클라이언트 객체는 AWS 액세스 키, 시크릿 액세스 키, REGION 등의 인증 정보를 사용하여 AWS 서비스와 통신합니다. 이를 통해 S3 서비스와 상호 작용하는 API를 호출할 수 있습니다.
        const s3 = new S3Client({
                region: AWS_REGION,
                credentials: {
                        accessKeyId: AWS_ACCESS_KEY_ID,
                        secretAccessKey: AWS_SECRET_ACCESS_KEY
                }
        });

        // 핸들러 이벤트에서 쿼리를 가져옴 
        let query = getQuery(event);

        //console.log(query)

        // 원본이미지 확장자         
        let strArry = query.fileType?.toString().split('/') as []
        let originExt = strArry.pop()+'' as string

        //console.log(originExt)

        // query: {
        //         fileUuid: fileData.uuid,
        //         fileName: fileData.name,
        //         fileType: fileData.obj.type,
        // },

        // 현재 시간을 기반으로 고유한 파일 키 생성
        const timestamp = new Date().getTime();
        const key = `${timestamp}_${query.fileUuid}.${originExt}`;

        // S3에 업로드될 파일의 속성을 정의하는 매개 변수 객체 생성
        const params = {
                Bucket: AWS_BUCKET_NAME,
                Key: key,
                ContentType: query.fileType
        } as any;

        // 업로드할 파일에 대한 PutObjectCommand 객체 생성
        // PutObjectCommand를 사용하여 S3 버킷에 객체를 업로드할 수 있다
        const command = new PutObjectCommand(params);

        // 미리 서명 된 URL을 생성
        const signedUrl = await getSignedUrl(s3, command, {
                expiresIn: 3600, // URL 만료 시간 (초)
        });

        // 생성된 미리 서명 된 URL을 반환
        return {uploadUrl:signedUrl, fileName:key};
})