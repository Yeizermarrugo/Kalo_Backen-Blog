const router = require('express').Router()
const comments = require('./comment.http')
const passportJwt = require('../middleware/auth.middleware')


router.get('/:id', passportJwt, comments.getById)
router.get('/:ideaId',passportJwt, comments.getByIdea)
router.post('/:ideaId', passportJwt, comments.register)

module.exports ={
    router
}