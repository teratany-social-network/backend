import path from "path"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import compression from "compression"
import swaggerUi from 'swagger-ui-express'
import swaggerAuthentication from './docs/swagger/authentication.json'
import { AuthRouter } from "./routes/auth.routes"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/teratany"
mongoose.set("strictQuery", false).connect(MONGO_URL).then(() => console.log("MongoDB connected to: " + MONGO_URL)).catch(() => "MongoDB connection Error")

const combinedSwaggerDocument = {
    ...swaggerAuthentication,
    // ... ajoutez d'autres spécifications comme nécessaire
}
// Utiliser le module swagger-ui-express pour servir les spécifications Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(combinedSwaggerDocument))

app.use(morgan("dev"))
app.use(compression())
app.use(bodyParser.json())
app.use(cors({ origin: "*" }))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user/authentication', AuthRouter)

app.use("/public", express.static(path.join(__dirname, "/public")))
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
