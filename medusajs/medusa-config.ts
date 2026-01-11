import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

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
          key: Modules.FILE,
          resolve: '@medusajs/file',
          options: {
            providers: [
              ...(MINIO_ENDPOINT && MINIO_ACCESS_KEY && MINIO_SECRET_KEY ? [{
                resolve: './src/modules/minio-file',
                id: 'minio',
                options: {
                  endPoint: MINIO_ENDPOINT,
                  accessKey: MINIO_ACCESS_KEY,
                  secretKey: MINIO_SECRET_KEY,
                  bucket: MINIO_BUCKET // Optional, default: medusa-media
                }
              }] : [{
                resolve: '@medusajs/file-local',
                id: 'local',
                options: {
                  upload_dir: 'static',
                  backend_url: `${BACKEND_URL}/static`
                }
              }])
            ]
          }
        },

        ...(REDIS_URL ? [
          {
            key: Modules.CACHE,
              resolve: '@medusajs/medusa/cache-redis',
              options: {
                redisUrl: REDIS_URL
              }
          },
          {
              key: Modules.EVENT_BUS,
              resolve: '@medusajs/event-bus-redis',
              options: {
                redisUrl: REDIS_URL
              }
            },
            {
              key: Modules.WORKFLOW_ENGINE,
              resolve: '@medusajs/workflow-engine-redis',
              options: {
                redis: {
                  url: REDIS_URL,
                }
              }
            }] : []),

        {
          resolve: "./src/modules/product-review"
        },

   ],
})
