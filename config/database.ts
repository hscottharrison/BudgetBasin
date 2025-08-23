// config/database.ts (Adonis v6)
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import { parse } from 'pg-connection-string'

const url = env.get('DATABASE_URL')

const connectionFromUrl = (() => {
  if (!url) return null
  const cfg = parse(url)
  return {
    host: cfg.host || undefined,
    port: Number(cfg.port) || 5432,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database || undefined,
    ssl: { rejectUnauthorized: false },
  }
})()

export default defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: connectionFromUrl ?? {
        host: env.get('DB_HOST'),
        port: Number(env.get('DB_PORT') || 5432),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: { rejectUnauthorized: false },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})
