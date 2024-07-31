import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import fs from 'node:fs';
import path from 'path';
import resolvers from '../../graphql/resolvers';
import prisma from '../../lib/prisma';
import allowCors from '../../utils/cors';
import { authOptions } from './auth/[...nextauth]';

const schemaPath = path.join(process.cwd(), 'graphql/schema.graphql');
const typeDefs = fs.readFileSync(schemaPath, 'utf8');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const getLoggedInUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  prisma: PrismaClient
) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (user) {
    return user;
  }
  return null;
};

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({
    req,
    res,
    user: await getLoggedInUser(req, res, prisma),
  }),
});

export default allowCors(handler);
