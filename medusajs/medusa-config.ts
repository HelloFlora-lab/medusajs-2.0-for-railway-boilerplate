import { loadEnv, defineConfig } from '@medusajs/framework/utils'

import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  REDIS_URL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  WORKER_MODE,
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET
} from './src/lib/constants';

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  admin: {
    backendUrl: BACKEND_URL,
    path: "/app",
   },
  projectConfig: {
    databaseUrl: DATABASE_URL,
    workerMode: WORKER_MODE,
    redisUrl: REDIS_URL,
    http: {
      storeCors: STORE_CORS!,
      adminCors: ADMIN_CORS!,
      authCors: AUTH_CORS!,
      jwtSecret: JWT_SECRET || "supersecret",
      cookieSecret: COOKIE_SECRET || "supersecret",
    }
  },
   modules: [
    {
       resolve: "@medusajs/medusa/cache-redis",
       options: {
        redisUrl: REDIS_URL,
       },
      },
      {
       resolve: "@medusajs/medusa/event-bus-redis",
       options: {
        redisUrl: REDIS_URL,
       }
      },
      {
       resolve: "@medusajs/medusa/workflow-engine-redis",
       options: {
        redis: {
         url: REDIS_URL,
        }
       }
    },
     {
      resolve: "./src/modules/product-review"
    },

   ],
})
