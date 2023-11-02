
import mainDoc from './mainDoc.json'
import profile from './profile.json'
import file from './file.json'
import authentication from './authentication.json'
const mergedDoc = {
    ...authentication,
    ...file,
    ...profile,
}

mainDoc.paths = mergedDoc
export const swaggerDoc = {
    ...mainDoc
}