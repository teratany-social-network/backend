
import mainDoc from './mainDoc.json'
import profile from './profile.json'
import file from './file.json'
import authentication from './authentication.json'
import publication from './publication.json'
const mergedDoc = {
    ...authentication,
    ...file,
    ...profile,
    ...publication,
}

mainDoc.paths = mergedDoc
export const swaggerDoc = {
    ...mainDoc
}