const uuid = require('uuid');
const Idea = require('../models/idea.models');
const User = require('../models/users.models');
const Comments = require('../models/comment.models');
const responses = require('../utils/handleResponses');

const getAllIdea = async () => {
    const data = await Idea.findAll({
        include: [
            {
                model: User,
                attributes: {
                    exclude: ["password", "createdAt", "updatedAt", "phone"]
                }
            },
            {
                model: Comments,
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ["password", "createdAt", "updatedAt", "phone"]
                        }
                    }
                ],
                attributes: {
                    exclude: ["author", "ideaId", "userId"]
                }
            }
        ],
        attributes: {
            exclude: ["userId", "author", "createdAt", "updatedAt"]
        }
    });
    return data;
}


const getIdeaById = async (id) => {
    const data = await Idea.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })
    return data
}

const createIdea = async (author, data) => {
    const newIdea = await Idea.create({
        id: uuid.v4(),
        idea: data.idea,
        description: data.description,
        imagekey: data.imagekey,
        author: author
    });
    return newIdea;
};


const editIdea = async (id, data) => {
    const response = await Idea.update(data, imagekey, {
        where: {
            id: id
        }
    })
    return response
}

const deleteIdea = async (id) => {
    const data = await Idea.destroy({
        where: {
            id: id
        }
    })
    return data
}


// const upvote = async (req, res) => {
//     try {
//       const ideaId = req.params.id;
//       const userId = req.user.id;
  
//       const idea = await getIdeaById(ideaId);
  
//       if (!idea) {
//         return responses.error({
//           res,
//           status: 404,
//           message: 'Idea not found',
//         });
//       }
  
//       const { upvotes, downvotes } = idea;
  
//       // Verificar si el usuario ya ha votado
//       if (upvotes.includes(userId) || downvotes.includes(userId)) {
//         return responses.error({
//           res,
//           status: 400,
//           message: 'User has already voted',
//         });
//       }
  
//       // Registrar el voto del usuario
//       idea.upvotes.push(true);
//       const savedIdea = await idea.update(ideaId, {upvotes: idea.upvote}); // Guardar los cambios en la base de datos
//       console.log("Aqui esta el savedIdea",savedIdea); // Imprimir el resultado de la operación de guardado
  
//       return responses.success({
//         res,
//         status: 200,
//         message: 'Upvote registered successfully',
//         data: savedIdea,
//       });
//     } catch (err) {
//       console.log(err);
//       return responses.error({
//         res,
//         status: 500,
//         message: 'Error occurred while registering upvote',
//       });
//     }
//   };
  
  
//   const downvote = async (req, res) => {
//     try {
//       const ideaId = req.params.id;
//       const userId = req.user.id;
  
//       const idea = await Idea.findByPk(ideaId);
  
//       if (!idea) {
//         return responses.error({
//           res,
//           status: 404,
//           message: 'Idea not found',
//         });
//       }
  
//       const { upvotes, downvotes } = idea;
  
//       // Verificar si el usuario ya ha votado
//       if (upvotes.includes(userId) || downvotes.includes(userId)) {
//         return responses.error({
//           res,
//           status: 400,
//           message: 'User has already voted',
//         });
//       }
  
//       // Registrar el voto del usuario
//       idea.downvotes.push(true);
//       await idea.save(); // Guardar los cambios en la base de datos
  
//       return responses.success({
//         res,
//         status: 200,
//         message: 'Downvote registered successfully',
//         data: idea,
//       });
//     } catch (err) {
//       console.log(err);
//       return responses.error({
//         res,
//         status: 500,
//         message: 'Error occurred while registering downvote',
//       });
//     }
//   };

const upvoteIdea = async (ideaId) => {
    if (!ideaId) {
      const error = new Error();
      error.status = 400;
      error.message = "ideaId must be sent";
      throw error;
    }
  
    const idea = await getIdeaById(ideaId);
    if (!idea) {
      const error = new Error();
      error.status = 400;
      error.message = "Idea not found";
      throw error;
    }
  
    idea.upvotes.push(true);
  
    return await Idea.update({ upvotes: idea.upvotes }, { where: { id: ideaId } });
  };

  const downVoteIdea = async (ideaId) => {
    if (!ideaId) {
      const error = new Error();
      error.status = 400;
      error.message = "ideaId must be sent";
      throw error;
    }
  
    const idea = await getIdeaById(ideaId);
    if (!idea) {
      const error = new Error();
      error.status = 400;
      error.message = "Idea not found";
      throw error;
    }
  
    idea.downvotes.push(true);
  
    return await Idea.update({ downvotes: idea.downvotes }, { where: { id: ideaId } });
  };

module.exports = {
    getAllIdea,
    getIdeaById,
    createIdea,
    editIdea,
    deleteIdea,
    upvoteIdea,
    downVoteIdea
}