import { hash, compare } from 'bcrypt'
import { ApolloError } from "apollo-server-express"
import { sign } from 'jsonwebtoken';
import 'dotenv/config'

type user = {
    id: number,
    username: string,
    email: string,
    displayName: string,
    followingCount: number,
    followerCount: number,
    password: string,
    avatar: string | null,
    bio: string | null,
    role: string,
    genre: string | null,
    banner: string | null,
    contactEmail: string | null,
}

const userResolver = {
    Query: {
        users: async (parent: any, args: user, ctx: any, info: any) => {
            const users = await ctx.prisma.user.findMany({ where: args })
            return users

        }
    },
    Mutation: {
        register: async (parent: any, { email, username, password, role, displayName }: any, ctx: any, info: any) => {
            const userRegistered = await ctx.prisma.user.findUnique({
                where: {
                    username
                }
            })

            if (userRegistered) {
                throw new ApolloError('User is aleady registered')
            }

            const hashedPass = await hash(password, 12)

            try {
                const user = await ctx.prisma.user.create({
                    data: {
                        email,
                        username,
                        password: hashedPass,
                        displayName,
                        role
                    }

                })

                return user

            } catch (error) {
                console.log("failed to register user")
                console.log(error)
            }
        },
        login: async (parent: any, { username, password }: any, ctx: any, info: any) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    username
                }
            })

            if (!user) {
                throw new ApolloError("Username is not registered");
            }

            const valid = await compare(password, user.password)

            if (!valid) {
                throw new ApolloError("Password is incorrect")
            }

            const userPayload = {
                id: user.id,
                role: user.role,
                username: user.username,
                displayName: user.displayName
            }

            ctx.res.cookie('jid', sign({ user: userPayload }, process.env.REFRESH_TOKEN!, { expiresIn: "14d" }), {
                httpOnly: true
            })

            return {
                token: sign({ user: userPayload }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "2h" })
            }

        }
    }
}

export default userResolver;