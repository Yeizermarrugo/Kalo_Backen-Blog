const {DataTypes} = require('sequelize')
const db  = require('../utils/database')
const Users = require('./users.models')
const Ideas = require('./idea.models')

const Comments = db.define('comments', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    author:{
        allowNull: false,
        type: DataTypes.UUID,
        field: "user_id",
        references: {
            model: Users,
            key: 'id'
        }
    },
    ideaId:{
        allowNull: false,
        type: DataTypes.UUID,
        field: "idea_id",
        references: {
            model: Ideas,
            key: 'id'
            }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'createdAt'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updatedAt'
    }

})

module.exports = 
Comments