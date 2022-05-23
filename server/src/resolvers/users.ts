import prisma from "../prisma";


const userResolver = {
    Query: {
        Users: async (parent: any, args: any, context: any, info: any) => {
            return await prisma.user.findMany({ where: args })
        }
    }
}

export default userResolver;