import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { db } from '../db';
import * as schema from '../db/schema';

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    'hupflow_secret_fallback_key_32_characters_minimum_entropy_2026',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      organization: schema.organizations,
      member: schema.members,
      account: schema.accounts,
      verification: schema.verifications,
      invitation: schema.invitations,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
  ],
});
