import { defineEventHandler, getQuery } from 'h3';
import * as Minio from 'minio'


export default defineEventHandler(async (event) => {
        // NUXT 런타임 환경 구성에서 AWS 액세스 키, 시크릿 액세스 키 및 REGION을 가져옴
        const { MINIO_SERVER_URL, MINIO_SERVER_PORT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY } = useRuntimeConfig();
                
        // Instantiate the MinIO client with the object store service
        // endpoint and an authorized user's credentials
        // play.min.io is the MinIO public test cluster
        const minioClient = new Minio.Client({
                endPoint: MINIO_SERVER_URL,
                port: MINIO_SERVER_PORT,
                useSSL: true,
                accessKey: MINIO_ACCESS_KEY,
                secretKey: MINIO_SECRET_KEY
        })

        const bucket = 'cbre-assets'

         // 핸들러 이벤트에서 쿼리를 가져옴 
         let query = getQuery(event);
         const key = query.key as string;

        if (!key) {
                return { status: 'failure', result: 'Minio file key (key) is missing.' };
        }
        
        try {
                // 1. Minio 파일 삭제 (단일 작업)
                await minioClient.removeObject(bucket, key);

                return { status: 'success', result: `Removed object for key: ${key}` };


        } catch (e: any) {
                // 파일이 이미 없거나 (NoSuchKey) 해도 성공으로 간주하여 클라이언트가 목록을 제거하도록 허용
                const isMinioKeyNotFound = e && typeof e.message === 'string' && e.message.includes('NoSuchKey');

                if (isMinioKeyNotFound) {
                console.warn(`Minio delete warning: Object ${key} not found.`);
                return { status: 'success', result: `Object ${key} not found in Minio.` };
                }

                console.error('Minio deletion failed:', e);
                return { status: 'failure', result: `Minio file deletion failed: ${e.message}` };
        }
        
})
