import prisma from '@/prisma/cbredb'
import bcrypt from 'bcrypt'

export default eventHandler(async (event) => {
        const body = await readBody(event)

        if (!body.email || !body.password) {
                throw createError({
                        statusCode: 400,
                        statusMessage: 'Bad Request',
                        message: 'Missing requiered fields',
                })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(body.password, salt)
        const allusers = await prisma.user.findMany()

        let newuser = null

        if (!allusers || allusers.length < 1) {
                let initSalt = await bcrypt.genSalt(10)
                let initHashedPassword = await bcrypt.hash('1111', initSalt)

                newuser = await prisma.user.create({
                        data: {
                                name: 'mhh',
                                email: 'mhh@devowls.kr',
                                hashedPassword: initHashedPassword,
                                profile: {
                                        create: {
                                                company: 'Devowls',
                                                branch: 'Korea',
                                                department: 'Development',
                                                title: 'Director',
                                        },
                                },

                                role: 'DEVELOPER',
                        },
                })
        } else {
                newuser = await prisma.user.create({
                        data: {
                                name: body.name,
                                email: body.email,
                                hashedPassword: hashedPassword,
                                role: 'USER',
                                profile: {
                                        create: {},
                                },
                        },
                })
        }

        return { ...newuser, hashedPassword: undefined }
})
