const {DataTypes} = require('sequelize')
const db  = require('../utils/database')
const Users = require('./users.models')
const Comments = require('./comment.models')

const Ideas = db.define('ideas', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
    },
    idea:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    imagekey: {
        type: DataTypes.STRING
    },
    upvotes: {
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        defaultValue: []
    },
    downvotes: {
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        defaultValue: []
    },
    author: {
        allowNull: false,
        type: DataTypes.UUID,
        field: 'user_id',
        references: {
          model: Users,
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
Ideas