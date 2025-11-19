import prisma from '@/prisma/cbredb'
export default defineEventHandler(async (event) => {
        const query = getQuery(event)
        const result = await prisma.user.findUnique({
                where: {
                        email: query.email as string,
                },
        })
        return result ? true : false
})
