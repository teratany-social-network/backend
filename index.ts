import path from "path"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import compression from "compression"
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { AuthRouter } from "./routes/auth.routes"
dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/teratany"
mongoose.set("strictQuery", false).connect(MONGO_URL).then(() => console.log("MongoDB connected to: " + MONGO_URL)).catch(() => "MongoDB connection Error")


const options: swaggerJsdoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: `Teratany's API`,
            version: `1.0.0`,
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Serveur local',
            },
            {
                url: `https://api.teratany.org`,
                description: 'Serveur en production',
            },
        ],
    },
    apis: ['./routes/*.ts'],
}
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.use(morgan("dev"))
app.use(compression())
app.use(bodyParser.json())
app.use(cors({ origin: "*" }))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user/authentication', AuthRouter)

app.use("/public", express.static(path.join(__dirname, "/public")))
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))