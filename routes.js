express = require('express');
const controller = require('./controller')
const middlewares = require("./middlewares")

const router = express.Router();

//Rotas de Renderização
router.get('/', (req,res)=> {
    res.render('index',{"title":"Página Inicial"});
})

router.get('/login', (req,res)=> {
    let msg = null
    if(req.query.msg == "success") {
        msg = "Usuário criado com sucesso!"
    }
    res.render('login',{"title":"Login", "msg":msg});
})

router.get('/register', (req,res)=> {
    res.render('register',{"title":"Registrar"});
})

//Rota Privada
router.get('/usuarios',middlewares.checkToken, async (req,res)=> {
    res.render('usuarios',{"title":"Sistema", "users": (await controller.getUsers()).map(user => user.toObject())});
})

//Rota do Registro

router.post('/auth/register', controller.register)

//Rota do Login

router.post('/auth/login', controller.login)


module.exports = router;