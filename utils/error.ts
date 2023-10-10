import * as fs from 'fs'
const errorLogFile = 'errorLog.json'

export class ErrorHandler extends Error {
    description: String
    code: Number
    constructor(message: string, code: Number, error: Error) {
        super(message)
        this.code = code
        this.description = error.message
        registerError(message, error)
    }
}

export const registerError = (message: string, error: Error) => {
    const currentTime = new Date()
    const gmtPlus3Offset = 3 * 60 * 60 * 1000
    const gmtPlus3Time = new Date(currentTime.getTime() + gmtPlus3Offset)
    const time = gmtPlus3Time.toISOString()
    const errorData = {
        time,
        message,
        error: error.message,
        stack: error.stack,
        name: error.name,
    }
    let errorLog: any[] = []
    if (fs.existsSync(errorLogFile)) errorLog = JSON.parse(fs.readFileSync(errorLogFile, 'utf-8'))
    errorLog.push(errorData)
    fs.writeFileSync(errorLogFile, JSON.stringify(errorLog, null, 2), 'utf-8')
}