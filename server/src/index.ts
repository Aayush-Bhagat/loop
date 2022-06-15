import { ApolloServer } from 'apollo-server-express';
import express from "express";
import { PrismaClient } from "@prisma/client";
import typeDefs from './schema';
import userResolver from './resolvers/userResolver';
import "dotenv/config"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { verify, sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

const corsOptions = {
    origin: '*',
    credentials: true
};


(async () => {
    const app = express()

    app.use(cookieParser())
    app.post("/refresh_token", async (req, res) => {
        const token = req.cookies.jid
        if (!token) {
            return res.send({ ok: false, accessToken: "" })
        }

        let payload;

        try {
            payload = verify(token, process.env.REFRESH_TOKEN!) as any
        } catch (err) {
            console.log(err);
            return res.send({ ok: false, accessToken: "" })
        }

        const userPayload = {
            id: payload.user.id,
            role: payload.user.role,
            username: payload.user.username,
            displayName: payload.user.displayName
        }

        res.cookie('jid', sign({ user: userPayload }, process.env.REFRESH_TOKEN!, { expiresIn: "14d" }), {
            httpOnly: true
        })
        res.send({ ok: true, accessToken: sign({ user: userPayload }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "2h" }) })
    })

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers: {
            Query: {
                ...userResolver.Query,
            },
            Mutation: {
                ...userResolver.Mutation
            }
        },
        csrfPrevention: true,
        context: ({ req, res }) => {
            return { req, res, prisma }
        },
    }
    )

    await apolloServer.start()

    apolloServer.applyMiddleware({ app, cors: corsOptions })

    app.listen(4000, () => {
        console.log(`Server started on localhost:4000`)
    })
})()

