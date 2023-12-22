import path from "path"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import compression from "compression"
import swaggerUi from 'swagger-ui-express'
import statusMonitor from 'express-status-monitor'
import { AuthRouter } from "./routes/auth.routes"
import { ProfileRouter } from "./routes/profile.routes"
import { SwaggerTheme } from "swagger-themes"
import { FileRouter } from "./routes/file.routes"
import { swaggerDoc } from "./docs/swaggerDoc"
import { PublicationRouter } from "./routes/publication.routes"
import { HistoriqueRouter } from "./routes/historique.routes"
import { TextColor, colorize } from "./utils/colorize"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 9900

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/teratany"
mongoose.set("strictQuery", false).connect(MONGO_URL)
.then(() => console.log("🥭  Database   : " + colorize(MONGO_URL, TextColor.blue)))
.catch(() => colorize(MONGO_URL, TextColor.red))



const theme = new SwaggerTheme('v3');

const options = {
    explorer: true,
    customCss: `.swagger-ui .topbar { display: none } .title span { display: none } .view-line-link.copy-to-clipboard { width: 24px !important; height: 24px !important;     margin: 0 5px !important;} ${theme.getBuffer('flattop')}`,
    customSiteTitle: 'Documentation Teratany',
    displayOperationId: true
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options))

app.use(morgan("dev"))
app.use(compression())
app.use(statusMonitor({
    title: 'Teratany Status',
    theme: 'default.css',
    healthChecks: [{
        protocol: 'http',
        host: 'localhost',
        path: '/profile/',
        port: PORT
    }, {
        protocol: 'http',
        host: 'localhost',
        path: '/public/blank',
        port: PORT
    }]
}))
app.use(bodyParser.json())
app.use(cors({ origin: "*" }))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/authentication', AuthRouter)
app.use('/profile', ProfileRouter)
app.use('/upload', FileRouter)
app.use('/publication', PublicationRouter)
app.use('/historique', HistoriqueRouter)

app.use("/public", express.static(path.join(__dirname, "/public")))

app.listen(PORT, () => {
    console.log(`\n`)
    console.log(`⚡  BaseURL    : ${colorize(`http://localhost:${PORT}`, TextColor.yellow)}`);
    console.log(`📃  API Docs   : ${colorize(`http://localhost:${PORT}/docs`, TextColor.yellow)}`);
    console.log(`📊  Monitoring : ${colorize(`http://localhost:${PORT}/status`, TextColor.yellow)}`); 
    console.log(`\n`)
})
