const uuid = require('uuid');
const Comment = require('../models/comment.models')
const User = require('../models/users.models')



const getCommentById = async (id) =>{
    const data = await Comment.findOne({
        where: {
            id:id
        }
    })
    return data
}

const getIdeaComment = async (ideaId) =>{
    const data = await Comment.findAll({
        where: {
            ideaId:ideaId
            }
            })
            return data
}

const createComment = async (author, data, ideaId) =>{
    const newComment = await Comment.create({
        id: uuid.v4(),
        description: data.description,
        author: author,
        ideaId: ideaId
    })
    return newComment
}

const editComment = async (id, data) =>{
    const response = await Comment.update(data,{
        where: {
            id: id
            }
    })
    return response
}

const deleteComment = async (id) =>{
    const data = await Comment.destroy({
        where: {
            id: id
            }
    })
    return data
}

module.exports = {
    getCommentById,
    getIdeaComment,
    createComment,
    editComment,
    deleteComment
}