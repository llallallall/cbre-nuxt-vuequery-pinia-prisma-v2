import prisma from '@/prisma/cbredb'
import { TemperatureType } from '@prisma/client'
export default defineEventHandler(async (event) => {

                let query = getQuery(event)

                let propertyId = query.propertyId

                let s3propertyImagesList = []
                let s3floorPlanImagesList = []
                let s3brochureFilesList = []

                //get s3 url(key)
                if( propertyId ) {
                        let propertyImagesResult = await prisma.propertyImageFile.findMany({
                                select : {
                                        file_key : true
                                },
                                where: {
                                        "property_id": propertyId as string
                                }
                        })

                        for(let i=0; i < propertyImagesResult.length; i++) {
                                let item = propertyImagesResult[i]
                                s3propertyImagesList.push(item.file_key) 
                        }

                        

                        let floorPlanImagesResult = await prisma.floorPlanFile.findMany({
                                select : {
                                        file_key : true
                                },
                                where: {
                                        "property_id": propertyId as string
                                }
                        })

                        for(let i=0; i < floorPlanImagesResult.length; i++) {
                                let item = floorPlanImagesResult[i]
                                s3floorPlanImagesList.push(item.file_key) 
                        }

                        

                        let brochureFilesResult = await prisma.propertyBrochureFile.findMany({
                                select : {
                                        file_key : true
                                },
                                where: {
                                        "property_id": propertyId as string
                                }
                        })

                        for(let i=0; i < brochureFilesResult.length; i++) {
                                let item = brochureFilesResult[i]
                                s3brochureFilesList.push(item.file_key) 
                        }

                         
                }

                // console.log(s3propertyImagesList)
                // console.log(s3floorPlanImagesList)
                // console.log(s3brochureFilesList)

                // delete from s3
                let deleteResult = new Object() as any
                if( propertyId ) {
                        
                        let propertyImagesDeleteResult = []
                        for(let i=0; i < s3propertyImagesList.length; i++) {
                                let fileKey = s3propertyImagesList[i]

                                let result = s3fileDeleteByKey(fileKey as string)
                                propertyImagesDeleteResult.push(result)
                        }

                        deleteResult.propertyImages = propertyImagesDeleteResult


                        let floorPlanImagesDeleteResult = []
                        for(let i=0; i < s3floorPlanImagesList.length; i++) {
                                let fileKey = s3floorPlanImagesList[i]

                                let result = s3fileDeleteByKey(fileKey as string)
                                floorPlanImagesDeleteResult.push(result)
                        }

                        deleteResult.floorPlanImages = floorPlanImagesDeleteResult


                        let brochureFilesDeleteResult = []
                        for(let i=0; i < s3brochureFilesList.length; i++) {
                                let fileKey = s3brochureFilesList[i]

                                let result = s3fileDeleteByKey(fileKey as string)
                                brochureFilesDeleteResult.push(result)
                        }

                        deleteResult.brochureFiles = brochureFilesDeleteResult

                }
        
                

                return deleteResult
     
})


async function s3fileDeleteByKey (file_key : string){

        let deleteResult

        // 1) s3 signedUrl 생성 및 파일 삭제  
        await $fetch('/api/upload/s3SignedUrl', {
                method: 'delete',
                        query: {
                                key: file_key
                        },
        }).then(async (signedUrl : any)=>{ 

                deleteResult = await fetch(signedUrl.deleteUrl     , {
                        method: 'DELETE',
                        headers: {
                                'Content-Type': 'application/json',
                        },
                })
        
        
        })

        return deleteResult
}