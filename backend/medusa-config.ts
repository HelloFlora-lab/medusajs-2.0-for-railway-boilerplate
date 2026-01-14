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
  MINIO_BUCKET,
  SLACK_WEBHOOK_URL,
  SLACK_ADMIN_URL
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

        ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET ? [{
              key: Modules.PAYMENT,
              resolve: '@medusajs/payment',
              options: {
                providers: [
                  {
                    resolve: '@medusajs/payment-stripe',
                    id: 'stripe',
                    options: {
                      apiKey: STRIPE_API_KEY,
                      webhookSecret: STRIPE_WEBHOOK_SECRET,
                    },
                  },
                ],
              },
            }] : []),
            
             ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL || SLACK_WEBHOOK_URL && SLACK_ADMIN_URL ? [{
                  key: Modules.NOTIFICATION,
                  resolve: '@medusajs/notification',
                  options: {
                    providers: [
                      ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL ? [{
                        resolve: '@medusajs/notification-sendgrid',
                        id: 'sendgrid',
                        options: {
                          channels: ['email'],
                          api_key: SENDGRID_API_KEY,
                          from: SENDGRID_FROM_EMAIL,
                        }
                      }] : []),
                      ,
                      ...(SLACK_WEBHOOK_URL && SLACK_ADMIN_URL ? [{
                          resolve: './src/modules/slack',
                          id: 'slack',
                          options: {
                            channels: ["slack"],
                            webhook_url: process.env.SLACK_WEBHOOK_URL,
                            admin_url: process.env.SLACK_ADMIN_URL
                            },
                      }] : []),
                      ,

                       {resolve: "@medusajs/medusa/notification-local",
                        id: "local",
                        options: {
                          name: "Local Notification Provider",
                          channels: ["feed"],
                        },
                      }
                                
                    ]
                  }
                }] : []),

        {
          resolve: "./src/modules/product-review"
        },

   ],
})
