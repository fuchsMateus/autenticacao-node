express = require('express');
const controller = require('./controller')
const middlewares = require("./middlewares")

const router = express.Router();

//Rota Pública
router.get('/', (req,res)=> {
    res.status(200).json({"msg": "Bem vindo!"})
})

//Rota Privada
router.get('/user/:id',middlewares.checkToken, controller.getUser)

//Rota do Registro

router.post('/auth/register', controller.register)

//Rota do Login

router.post('/auth/login', controller.login)


module.exports = router;