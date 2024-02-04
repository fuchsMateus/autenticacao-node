//Imports
const path = require('path')
require('dotenv').config({path: './.env'});
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//Inicialização
const app = express();

//Usar recursos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Habilitar requisicoes POST
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cookieParser());

//Template Engine
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
  }));
app.set('view engine', 'handlebars');

//Permite usar json
app.use(express.json());

//Acessa as rotas
app.use(require('./routes'));

//Credenciais
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

//Conectar o banco
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.hqoco5a.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
    app.listen(8080)
    console.log("Conectou ao banco")
})
.catch((err)=> console.log(err)
)