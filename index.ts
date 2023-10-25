import path from "path"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import compression from "compression"
import swaggerUi from 'swagger-ui-express'
import swagger from './docs/swagger.json'
import statusMonitor from 'express-status-monitor'
import { AuthRouter } from "./routes/auth.routes"
import { USerRouter } from "./routes/user.routes"
import { SwaggerTheme } from "swagger-themes"
import { FileRouter } from "./routes/file.routes"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/teratany"
mongoose.set("strictQuery", false).connect(MONGO_URL).then(() => console.log("MongoDB connected to: " + MONGO_URL)).catch(() => "MongoDB connection Error")

const combinedSwaggerDocument = {
    ...swagger,
}

const theme = new SwaggerTheme('v3');

const options = {
    explorer: true,
    customCss: `.swagger-ui .topbar { display: none } .title span { display: none } .view-line-link.copy-to-clipboard { width: 24px !important; height: 24px !important;     margin: 0 5px !important;} ${theme.getBuffer('flattop')}`,
    customSiteTitle: 'Documentation Teratany',
    displayOperationId: true
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(combinedSwaggerDocument, options))

app.use(morgan("dev"))
app.use(compression())
app.use(statusMonitor())
app.use(bodyParser.json())
app.use(cors({ origin: "*" }))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user/authentication', AuthRouter)
app.use('/user/', USerRouter)
app.use('/upload/', FileRouter)

app.use("/public", express.static(path.join(__dirname, "/public")))
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
