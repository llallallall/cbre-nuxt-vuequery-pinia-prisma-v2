import prisma from '@/prisma/cbredb'
import { TemperatureType } from '@prisma/client'
export default defineEventHandler(async (event) => {
        
                let result = await prisma.property.findFirst({
                        select: {
                                id: true,
                        },
                        orderBy: {
                                id: 'desc',
                        },
                })

                return result
     
})
