import prisma from '@/prisma/cbredb'

export default defineEventHandler(async (event) => {
        const query = getQuery(event)

        let id = query.id as string

        if(query.id) {

            let profileResult = await prisma.profile.findUnique({
                select: {
                        image_url: true,
                        use_profile_image : true,
                    },
                where : {
                    userId : id
                }    
            })

            if( profileResult?.use_profile_image) {
                return profileResult.image_url
            } else {

                let userResult = await prisma.user.findUnique({
                    select: {
                            image: true,
                        },
                    where : {
                        id : id
                    }    
                })

                return userResult?.image

            }


        } else {

            return false

        }
        
})
