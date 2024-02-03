//Imports
const path = require('path')
require('dotenv').config({path: './.env'});
const express = require('express');
const mongoose = require('mongoose');

//Inicialização
const app = express();
//Permite usar json
app.use(express.json())
//Acessa as rotas
app.use(require('./routes'))

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