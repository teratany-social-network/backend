import { Router } from "express"
import { Request, Response } from "express"
import multer from "multer"
import sharp from "sharp"
import { ErrorHandler } from "../utils/error"
const FileRouter = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, "public/") },
    filename: function (req, file, cb) {
        const timestamp = new Date().getTime();
        cb(null, `${timestamp}-${file.originalname}`);
    },
});

var fileUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});

FileRouter.post("/", fileUpload.array("images", 30), async (req: Request, res: Response) => {
    try {
        if (!req.files || req.files.length === 0) throw new ErrorHandler("Vous n'avez pas envoyé d'image", 400, new Error('No image to upload'))
        const uploadedFiles = []
        for (const file of req.files as Express.Multer.File[]) {
            const { path } = file
            await sharp(path)
                .resize({ width: 600 })
                .toFile(`public/resized-${file.filename}`)
            uploadedFiles.push(`resized-${file.filename}`)
        }
        res.send(uploadedFiles)
    } catch (err) {
        console.log(err);
        if (err instanceof ErrorHandler) throw err
        else throw new ErrorHandler("Impossible de télécharger vos images, nous y travaillons", 500, err)

    }
})



export { FileRouter }