// AWS SDK 및 S3 클라이언트와 PutObjectCommand를 가져옴
import * as Minio from 'minio'


export default defineEventHandler(async (event) => {
        // NUXT 런타임 환경 구성에서 AWS 액세스 키, 시크릿 액세스 키 및 REGION을 가져옴
        const { MINIO_SERVER_URL, MINIO_SERVER_PORT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY } = useRuntimeConfig();
        // console.log(MINIO_SERVER_URL)
        // console.log(MINIO_SERVER_PORT)
        // console.log(MINIO_ACCESS_KEY)
        // console.log(MINIO_SECRET_KEY)
        
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

        const files = await readMultipartFormData(event);

        let fileName:string
        let fileSize:number
        let fileBuffer:Buffer
        let fileKey:string
        
        let publicUrl:string =''
        if(files) {
                
                fileName = files.find(e => (e.name === 'fileName' ))?.data.toString() as string
                //console.log(fileName)
                fileSize = parseInt(files.find(e => (e.name === 'fileSize' ))?.data.toString() as string) as number
                //console.log(files.find(e => (e.name === 'fileObj' )))
                fileBuffer = files.find(e => (e.name === 'fileObj' ))?.data as Buffer

                fileKey = files.find(e => (e.name === 'fileKey' ))?.data.toString() as string

                const uploadResult = await minioClient.putObject(bucket, fileKey, fileBuffer, fileSize, function (err:any, objInfo:any) {
                        if (err) {
                          console.log(err) // err should be null

                          return  {uploadUrl:null, fileName: fileKey};        
                        } else {
                        console.log('Success', objInfo)
                        //make pulick url 
                        publicUrl = 'https://' +MINIO_SERVER_URL + '/' + bucket + '/' + fileKey as string

                        console.log(publicUrl)

                        return  {uploadUrl:publicUrl, fileName: fileKey};        
                        }
                        
                })

                console.log(uploadResult)
                return uploadResult
               

        } else {
                return  {uploadUrl:null, fileName: null};
        }
        
})
