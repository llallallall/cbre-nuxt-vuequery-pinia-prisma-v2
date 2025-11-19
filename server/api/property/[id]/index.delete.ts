
import prisma from '@/prisma/cbredb'

export default defineEventHandler(async (event) => {
                let query = getQuery(event);

                let propertyId = query.propertyId 
                //console.log(propertyId)

                let result = new Object() as any


                if( propertyId ) {
                

                        let propertyResult = await prisma.property.delete({
                                where: {
                                        "id": propertyId as string
                                }
                        })

                        //console.log(propertyResult)

                        result.property = propertyResult


                
                        let propertyImagesResult = await prisma.propertyImageFile.deleteMany({
                                where: {
                                        "property_id": propertyId as string
                                }
                        })

                        result.propertyImages = propertyImagesResult

                        let floorPlanImagesResult = await prisma.floorPlanFile.deleteMany({
                                where: {
                                        "property_id": propertyId as string
                                }
                        })

                        result.floorPlanImages = floorPlanImagesResult

                        

                        let brochureFilesResult = await prisma.propertyBrochureFile.deleteMany({
                                where: {
                                        "property_id": propertyId as string
                                }
                        })

                        result.brochureFiles = brochureFilesResult

                }

               

        return result
})