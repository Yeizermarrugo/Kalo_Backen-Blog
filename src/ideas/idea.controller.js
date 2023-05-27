const uuid = require('uuid');
const Idea = require('../models/idea.models');
const User = require('../models/users.models');
const Comments = require('../models/comment.models');
const responses = require('../utils/handleResponses');
const { uploadFile } = require('../utils/aws-s3-bucket');

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
        imagekey: data.imagekey ? data.imagekey : '',
        author: author
    });
    return newIdea;
};

const uploadImg = async (ideaId, file) => {
    try {
        if (!file) {

            responses.success({
                message: "No File Uploaded",
                status: 400
            })
        }
        let fileKey = `public/images/imgByIdea-${ideaId}`
        if (file.mimetype == 'image/jpg') {
            fileKey += '.jpg';
        } else if (file.mimetype == 'image/jpeg') {
            fileKey += '.jpeg';
        } else if (file.mimetype == 'image/png') {
            fileKey += '.png';
        } else {
            responses.error({
                message: 'Unsupported image type',
                status: 400
            });
        }
        const URL = await uploadFile(file, fileKey)
        console.log("URL" ,URL);
        const bucketURL = process.env.AWS_DOMAIN + fileKey
        // const user = await userServices.uploadImage(bucketURL, userId)
        const data = {imagekey: bucketURL}
        const idea = await editIdea(ideaId, data)

        return { results: { message: 'Image Added' }, idea }
    }
    catch (err) {
        console.log(err)

    }

}



const editIdea = async (id, data) => {
    const response = await Idea.update(data, {
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
    downVoteIdea,
    uploadImg
}