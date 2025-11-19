import prisma from '@/prisma/cbredb'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    //console.log(body)

    let profileData = body.profile as any

    let updateResult = new Object as any

    if (profileData.password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(profileData.password, salt)

        let passwordResult = await prisma.user.update({
            where: {
                id: profileData.id
            },
            data: {
                hashedPassword: hashedPassword,
            }
        })

        updateResult.password = passwordResult

    }


    if (profileData.name) {

        let nameResult = await prisma.user.update({
            where: {
                id: profileData.id
            },
            data: {
                name: profileData.name,
            }
        })

        updateResult.name = nameResult
    }




    if (profileData.image) {

        let imageResult = await prisma.user.update({
            where: {
                id: profileData.id
            },
            data: {
                image: profileData.image,
            }
        })

        updateResult.avatar = imageResult
    }




    if (profileData.photo) {

        let photoResult = await prisma.profile.upsert({
            where: {
                userId: profileData.id
            },
            update: {
                image_url: profileData.photo
            },
            create: {
                userId: profileData.id,
                image_url: profileData.photo
            },
        })
        updateResult.photo = photoResult
    }




    if (profileData.company) {

        let companyResult = await prisma.profile.upsert({
            where: {
                userId: profileData.id
            },
            update: {
                company: profileData.company
            },
            create: {
                userId: profileData.id,
                company: profileData.company
            },
        })

        updateResult.company = companyResult
    }




    if (profileData.branch) {

        let branchResult = await prisma.profile.upsert({
            where: {
                userId: profileData.id
            },
            update: {
                branch: profileData.branch
            },
            create: {
                userId: profileData.id,
                branch: profileData.branch
            },
        })

        updateResult.branch = branchResult
    }




    if (profileData.department) {

        let departmentResult = await prisma.profile.upsert({
            where: {
                userId: profileData.id
            },
            update: {

                department: profileData.department

            },
            create: {
                userId: profileData.id,

                department: profileData.department

            },
        })

        updateResult.department = departmentResult
    }


    if (profileData.title) {

        let titleResult = await prisma.profile.upsert({
            where: {
                userId: profileData.id
            },
            update: {
                title: profileData.title
            },
            create: {
                userId: profileData.id ,
                title: profileData.title,
            },
        })

        updateResult.title = titleResult
    }


    if (profileData.usePhoto !== null) {

        let useProfileImageResult = await prisma.profile.upsert({
            where: {
                userId: profileData.id
            },
            update: {
                use_profile_image: profileData.usePhoto ,
            },
            create: {
                userId: profileData.id,
                use_profile_image: profileData.usePhoto ,
            },
        })

        updateResult.useProfileImage = useProfileImageResult
    }


    return updateResult

        
})
