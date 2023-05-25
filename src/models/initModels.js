const Users = require('./users.models');
const Comments = require('./comment.models')
const Ideas = require('./idea.models')

const initModel = () => {
    
    //?User -> Idea
    Users.hasMany(Ideas)
    Ideas.belongsTo(Users)

    //?User -> Comment
    Users.hasMany(Comments)
    Comments.belongsTo(Users)

    //?Ideas -> Comments
    Ideas.hasMany(Comments);
    Comments.belongsTo(Ideas);
}

module.exports = initModel