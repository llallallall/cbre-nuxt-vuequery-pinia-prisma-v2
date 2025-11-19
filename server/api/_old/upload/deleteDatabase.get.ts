import prisma from '@/prisma/cbredb'

export default eventHandler(async (event) => {

            let query = getQuery(event);

            let result = await prisma.propertyImageFile.delete(
                            {
                                where : {
                                    propertyId: query.propertyId as string,
                                    file_uuid: query.fileUuid as string,
                                },
                            }
                        )
            return result         
                
})


        