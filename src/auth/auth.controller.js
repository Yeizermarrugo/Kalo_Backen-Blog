const { getUserByEmail } = require('../users/user.controller')
const { comparePassword } = require('../utils/crypt')

const loginUser = async (email, password) => {
    try {
        const user = await getUserByEmail(email)
        const verifyPassword = comparePassword(password, user.password)
        if (verifyPassword) {
            return user
        }
        else {
            return false
        }
    }catch (error) {
        return false
    }
}

module.exports = {
    loginUser
}