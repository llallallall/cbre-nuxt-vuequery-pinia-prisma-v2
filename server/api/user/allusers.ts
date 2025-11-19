import prisma from '@/prisma/cbredb'

export default defineEventHandler(async (event) => {
       
            let usersArray = new Array() as any
            await prisma.user.findMany({
                select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true
                        
                    }
            }).then(async (allusers : any)=>{

                // console.log('prisma.user.findMany')
                // console.log(allusers)
        
                for(let i=0; i< allusers.length; i++) {

                        let user = allusers[i]

                        let userObj = new Object() as any
                        userObj.id      = user.id as string 
                        userObj.name    = user.name as string  
                        userObj.email   = user.email as string  
                        userObj.image   = user.image as string  
                        userObj.role    = user.role as string  

                        let profileResult = await prisma.profile.findUnique({
                                select : {
                                        image_url         : true,
                                        company           : true,
                                        branch            : true,
                                        department        : true,
                                        title             : true,
                                        use_profile_image : true,
                                },
                                where : {
                                        userId : user.id
                                }
                        
                        }) as any
                        
                        let profileObj = new Object() as any 
                        profileObj.company      = profileResult.company as string
                        profileObj.branch       = profileResult.branch as string
                        profileObj.department   = profileResult.department as string
                        profileObj.title        = profileResult.title as string
                        profileObj.photo        = profileResult.image_url as string
                        profileObj.usePhoto     = profileResult.use_profile_image as boolean


                        userObj.profile = profileObj

                        usersArray.push(userObj)
                
                }


                


        })

        //console.log(usersArray)
        return usersArray

            
       
})
