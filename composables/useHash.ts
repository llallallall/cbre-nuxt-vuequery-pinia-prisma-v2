import bcrypt from 'bcrypt'
export async function hashString(value : string) {
    //let salt = await bcrypt.genSalt(10)
    //let hashedString = await bcrypt.hash(value, salt)
    return value
}