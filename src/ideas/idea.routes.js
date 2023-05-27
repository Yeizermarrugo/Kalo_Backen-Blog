const router = require('express').Router()
const idea = require('./idea.http')
const passportJwt = require('../middleware/auth.middleware')
const { upload } = require('../utils/multer')
// const {upVote,downvote} = require('./idea.controller')
const {multerPublicationsPhotos} = require('../utils/multer')



router.get('/', idea.getAll)
router.post('/', passportJwt, multerPublicationsPhotos.single('imagekey') ,idea.register)

router.get('/:id', idea.getById)
router.patch('/:id', passportJwt, idea.edit)
router.delete('/:id', passportJwt, idea.remove)

router.post('/:ideaId/upvotes', passportJwt, idea.upvoteIdea)
router.post('/:ideaId/downvotes', passportJwt, idea.downVoteIdea)

module.exports = {router}