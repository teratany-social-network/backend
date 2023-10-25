
import mainDoc from './mainDoc.json'
import user from './user.json'
import file from './file.json'
import pages from './pages.json'
import authentication from './authentication.json'
const mergedDoc = {
    ...authentication,
    ...file,
    ...user,
    ...pages
}

mainDoc.paths = mergedDoc
export const swaggerDoc = {
    ...mainDoc
}