import crypto from 'crypto';

const sha = (text:string) => {
    //creating hash object 
    const hash = crypto.createHash('sha256');
    //passing the data to be hashed
    let data = hash.update(text, 'utf-8');
    //Creating the hash in the required format
    let gen_hash = data.digest('hex');
    return gen_hash;
    
}
export {sha};