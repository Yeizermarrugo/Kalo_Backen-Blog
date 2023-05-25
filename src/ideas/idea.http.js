const ideaController = require('./idea.controller')
const responses = require('../utils/handleResponses')
const config = require('../../config').api

const getAll = (req, res) => {
    ideaController.getAllIdea()
        .then(data => {
            responses.success({
                status: 200,
                message: 'Getting all ideas',
                data: data,
                res
            })
        })
        .catch(err => {
            responses.error({
                status: 400,
                data: err,
                message: 'Error getting all ideas',
                res
            })
            console.log(err);
        })
}

const getById = (req, res) => {
    const id = req.params.id
    ideaController.getIdeaById(id)
        .then(data => {
            if (data) {
                responses.success({
                    status: 200,
                    data,
                    message: `Getting idea with id: ${id}`,
                    res
                })
            } else {
                responses.error({
                    status: 404,
                    message: `Idea with Id: ${id}, not found`,
                    res
                })
            }
        })
        .catch(err => {
            responses.error({
                status: 400,
                data: err,
                message: 'Something bad getting the idea',
                res
            })
        })
}

const register = async (req, res) => {
    try {
        const author = req.user.id;
        const servObj = req.body;
        const originalFilename = req.file.originalname;
        const sanitizedFilename = originalFilename.replace(/\s+/g, '_'); // Reemplazar espacios por guiones bajos

        servObj.imagekey = `${req.protocol}://${config.host}/public/${Math.floor(Date.now() / 1000)}-${sanitizedFilename}`; // Agregar el nombre del archivo sin espacios
        console.log("imagekey", servObj);
        const newIdea = await ideaController.createIdea(author, servObj);

        // Construir la URL completa para acceder a la imagen
        const imageUrl = servObj.imagekey;
        console.log("imageUrl", imageUrl);

        responses.success({
            status: 201,
            data: {
                ...newIdea.toJSON(),
                imageUrl
            },
            message: `Idea created successfully with id: ${newIdea.id}`,
            res
        });
    } catch (err) {
        console.log(err);
        responses.error({
            status: 400,
            data: err,
            message: 'Error occurred while trying to create a new idea',
            res,
            fields: {
                idea: 'String',
                description: 'String'
            }
        });
    }
};



const edit = (req, res) => {
    const id = req.params.id
    const data = req.body
    if (!Object.keys(data).length) { // si no existen los key, entro al error
        return res.status(400).json({ message: 'Missing data' })
    } else if (
        !data.idea ||
        !data.description
    ) {
        return res.status(400).json({
            message: 'All fields must be completed', fields: {
                idea: "String",
                description: "String",
                imagekey: "example.com/img/example.png"
            }
        })
    } else {
        const response = ideaController.editIdea(id, data)
        return res.status(200).json({
            message: 'Idea edited succesfully',
            idea: data
        })
    }

}

const remove = (req, res) => {
    const id = req.params.id

    ideaController.deleteIdea(id)
        .then(data => {
            if (data) {
                responses.success({
                    status: 200,
                    data,
                    message: `Idea with id: ${id} deleted successfully`,
                    res
                })
            } else {
                responses.error({
                    status: 404,
                    data: err,
                    message: `The idea with ID ${id} not found`,
                    res
                })
            }
        })
        .catch(err => {
            responses.error({
                status: 400,
                data: err,
                message: `Error ocurred trying to delete idea with id ${id}`,
                res
            })
        })
}


const upvoteIdea = async (req, res)=>{
    try {
        const ideaId = req.params.ideaId;
        console.log("Here is the ideaId", ideaId);
        const idea = await ideaController.upvoteIdea(ideaId);
        return responses.success({
            status: 200,
            data: idea,
            message: "Idea upvoted successfully",
            res
        });
      } catch (err) {
        console.log(err);
        return responses.error({
            status: 400,
            data: err,
            message: "Error ocurred trying to upvote idea",
            res
        })
      }
}

const downVoteIdea = async (req, res)=>{
    try {
        const ideaId = req.params.ideaId;
        console.log("Here is the ideaId", ideaId);
        const idea = await ideaController.downVoteIdea(ideaId);
        return responses.success({
            status: 200,
            data: idea,
            message: "Idea upvoted successfully",
            res
        });
      } catch (err) {
        console.log(err);
        return responses.error({
            status: 400,
            data: err,
            message: "Error ocurred trying to upvote idea",
            res
        })
      }
}

module.exports = {
    getAll,
    getById,
    register,
    edit,
    remove,
    upvoteIdea,
    downVoteIdea
}