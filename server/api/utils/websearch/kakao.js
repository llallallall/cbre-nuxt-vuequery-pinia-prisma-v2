export default defineEventHandler(async (event) => {
        let posts = await prisma.posts.findMany({
                orderBy: { id: 'desc' },
                include: { likes: true },
        })
        return posts
})
