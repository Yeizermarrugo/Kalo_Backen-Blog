const commentController = require('./comment.controlle')
const responses = require('../utils/handleResponses')


const getById = (req, res) => {
    const id = req.params.id
    commentController.getCommentById(id)
        .then(data => {
            if (data) {
                responses.success({
                    status: 200,
                    data,
                    message: `Getting comment with id: ${id}`,
                    res
                })
            } else {
                responses.error({
                    status: 404,
                    message: `Comment with Id: ${id}, not found`,
                    res
                })
            }
        })
        .catch(err => {
            responses.error({
                status: 400,
                data: err,
                message: 'Something bad getting the comment',
                res
            })
        })
}

const getByIdea = async (req, res) => {
    const ideaId = req.params.id
    commentController.getIdeaComment(ideaId)
        .then(data => {
            if (data) {
                responses.success({
                    status: 200,
                    data,
                    message: `Getting comments for idea: ${ideaId}`,
                    res
                })
            } else {
                responses.error({
                    status: 404,
                    message: `No comments for idea: ${ideaId}`,
                    res
                })
            }
        })
        .catch(err => {
            responses.error({
                status: 400,
                data: err,
                message: 'Something bad getting the comments',
                res
            })
        })

}

const register = async (req, res) => {
    const author = req.user.id
    const servObj = req.body
    const ideaId = req.params.ideaId
    console.log("Este es el author",author);
    console.log("Esta es la ideaId ----->",ideaId);
    commentController.createComment(author, servObj, ideaId)
        .then(data => {
            responses.success({
                status: 201,
                data,
                message: `Comment created succesfully with id: ${data.id}`,
                res
            })
        })
        .catch(err => {
            console.log(err);
            responses.error({
                status: 400,
                data: err,
                message: 'Error ocurred trying to create a new comment',
                res,
                fields: {
                    idea: "String",
                    description: "String"
                }
            })
        })
}


module.exports = {
    getById,
    getByIdea,
    register
}