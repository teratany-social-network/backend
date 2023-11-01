
import mainDoc from './mainDoc.json'
import profile from './profile.json'
import file from './file.json'
import pages from './pages.json'
import authentication from './authentication.json'
const mergedDoc = {
    ...authentication,
    ...file,
    ...profile,
    ...pages
}

mainDoc.paths = mergedDoc
export const swaggerDoc = {
    ...mainDoc
}