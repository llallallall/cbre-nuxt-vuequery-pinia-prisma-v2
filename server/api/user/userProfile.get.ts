import prisma from '@/prisma/cbredb'

export default defineEventHandler(async (event) => {
        const query = getQuery(event)

        //console.log(query)

        let id = query.id as string

        if(query.id) {


            let result = await prisma.profile.findUnique({
                select: {
                        image_url: true,
                        company: true,
                        branch: true,
                        department: true,
                        title: true,
                        use_profile_image : true,
                    },
                where : {
                    userId : id
                }    
            })

            //console.log(result)

            return result

        } else {

            return false

        }
        
})
