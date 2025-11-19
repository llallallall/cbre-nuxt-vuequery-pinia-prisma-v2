import prisma from '@/prisma/cbredb'
export default defineEventHandler(async () => {
        let result = await prisma.sector.findMany({
                select: {
                        id: true,
                        name: true,
                },
        })
        return result
})
