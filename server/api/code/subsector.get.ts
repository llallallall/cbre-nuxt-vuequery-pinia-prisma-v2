import prisma from '@/prisma/cbredb'
export default defineEventHandler(async () => {
        let result = await prisma.subSector.findMany({
                select: {
                        id: true,
                        sector_id: true,
                        name: true,
                },
        })
        return result
})
