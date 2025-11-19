// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/prisma/cbredb'
import bcrypt from 'bcrypt'

interface CredentialProps {
        email: string
        password: string
}

export default NuxtAuthHandler({
        secret: useRuntimeConfig().authSecret,
        pages: {
                signIn: '/login',
        },
        providers: [
                //@ts-expect-error
                GithubProvider.default({
                        clientId: useRuntimeConfig().githubClientID,
                        clientSecret: useRuntimeConfig().githubClientSecret,
                }),
                //@ts-expect-error
                CredentialsProvider.default({
                        name: 'Credentials',
                        credentials: {},
                        async authorize(credentials: CredentialProps) {
                                //TODO ; fetch user from database
                                //console.log('credentials')
                                const user = await prisma.user.findUnique({
                                        where: {
                                                email: credentials.email,
                                        },
                                })

                                if (!user) {
                                        throw createError({
                                                statusCode: 401,
                                                statusMessage: 'Unauthorized',
                                        })
                                }

                                const isValid = await bcrypt.compare(
                                        credentials.password,
                                        user.hashedPassword
                                )

                                if (!isValid) {
                                        throw createError({
                                                statusCode: 401,
                                                statusMessage: 'Unauthorized',
                                        })
                                }

                                return { ...user, hashedPassword: undefined }
                        },
                }),
        ],

        session: {
                strategy: 'jwt',
        },

        // jwt: {
        //         secret: useRuntimeConfig().authSecret,
        // },

        callbacks: {
                async jwt({ token, user}) {

                        // console.log('auth callback :: jwt')
                        // console.log(token)
                        // console.log(user)
                        // console.log(profile)
                        if (user) {
                                token = { ...token, ...user }
                        }

                        

                        // console.log('auth callback :: jwt + profile')
                        // console.log(token)

                        return token
                },

                async session({ session, token }) {

                        // console.log('auth callback :: session')

                        // console.log(session)
                        // console.log(token)

                        session.user = {
                                ...token,
                                ...session.user,
                        }
                        return session
                },
        },
})
