const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const restHandler = require('./utils/handleResponses');
const initModels = require('./models/initModels');
const config = require('../config').api
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path');
//*archivos de rutas
const userRoute = require('./users/user.routes').router
const authRoute = require('./auth/auth.routes').router
const ideaRoute = require('./ideas/idea.routes').router
const commentRoute = require('./comments/comment.routes').router
const swaggerDoc = require('./swagger.json')

//*Conexion BD
const db = require('./utils/database')

//*Configuracion inicial
const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

db.authenticate()
    .then(() => console.log('Database Authenticated'))
    .catch(() => console.log(err))

db.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.log(err))

initModels();

app.get('/', (req, res) => {
    restHandler.success({
        res,
        status: 200,
        message: 'Servidor inicializado correctamente',
        data:{
            "Blog": `${config.host}/v1/idea`
        }
    })
})

app.use('/v1/users', userRoute);
app.use('/v1/auth', authRoute);
app.use('/v1/ideas', ideaRoute);
app.use('/v1/comment', commentRoute);
const uploadPath = path.join(__dirname, '../uploads');
app.use('/public', express.static(uploadPath));

app.use('/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use('*', (req, res) => {
    restHandler.error({
        res,
        status: 404,
        message: `URL not found, please try with ${config.host}`
    })
})

app.listen(config.port, ()=>{
    console.log(`Server started at port ${config.port}`);
})

module.exports = app