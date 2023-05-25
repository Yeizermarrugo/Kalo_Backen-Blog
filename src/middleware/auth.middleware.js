const {getUserById} = require('../users/user.controller')
const { ExtractJwt, Strategy } = require('passport-jwt')
const passport = require('passport')

const config = require('../../config').api

const passportConfigs = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretOrKey
}

passport.use(new Strategy(passportConfigs, (tokenDecoded, done) =>{
    getUserById(tokenDecoded.id)
    .then(data =>{
        if(data){
            done(null, tokenDecoded)
        }else{
            done(null, false), {message: 'Token Incorrect'}
        }
    })
    .catch(err =>{
        done(err, false)
        })
}))

module.exports = passport.authenticate('jwt', {session: false})