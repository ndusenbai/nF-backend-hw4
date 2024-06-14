import 'dotenv/config'
import express from 'express'
import { createServer } from 'node:http'
import connectDB from './db'
import globalRouter from './routes/global-router'
import { logger } from './logger'
import { listBuckets, createBucket, deleteBucket, uploadFile, listObjectsInBucket } from './middlewares/s3-middleware'


connectDB()

const app = express()

app.use(express.json())
app.use(logger)
app.use('/api/v5', globalRouter)

const server = createServer(app)

listBuckets();

createBucket('n-factorial-2024');

deleteBucket('n-factorial-2024');

// uploadFile('n-factorial', '/home/nurdaulet/Downloads/rootkey (1).csv');

listObjectsInBucket('n-factorial');


server.listen(3000, () => {
  console.log('server running at http://localhost:3000/api/v5')
})
