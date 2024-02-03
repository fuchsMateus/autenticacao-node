const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Models
const User = require('./models/User')

const register = async(req,res)=> {
    const {name, email, password, confirmpassword} = req.body

    if(!name){
        return res.status(422).json({"msg":"O nome é obrigatório!"})
    }

    //regex para o nome
    if(!/^[a-zA-Z\s]+$/.test(name)){
        return res.status(422).json({"msg":"O nome só pode conter letras e espaços em branco!"})
    }

    if(!email){
        return res.status(422).json({"msg":"O email é obrigatório!"})
    }

    //regex para o email
    if(!/^\S+@\S+\.\S+$/.test(email)){
        return res.status(422).json({"msg":"O email está em um formato inválido!"})
    }

    if(!password){
        return res.status(422).json({"msg":"A senha é obrigatória!"})
    }

    if(password !== confirmpassword){
        return res.status(422).json({"msg":"A senhas não conferem!"})
    }

    //Checar se o usuario existe
    const userExists = await User.findOne({email: email})
    if(userExists){
        return res.status(422).json({"msg":"Por favor, utilize outro email!"})
    }

    //Criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Criar Usuario
    const user  =new User({
        name,
        email,
        password: passwordHash
    })

    try{

        await user.save()
        res.status(201).json({"msg":"Usuário criado com sucesso!"})

    }catch(error){
        res.status(500).json({"msg":"Ocorreu um erro no servidor, tente novamente mais tarde."})
    }
}

const login = async (req,res)=>{
    const {email, password} = req.body

    //Validação
    if(!email){
        return res.status(422).json({"msg":"O email é obrigatório!"})
    }

    if(!password){
        return res.status(422).json({"msg":"A senha é obrigatória!"})
    }

    //Checar se o usuario existe
    const user = await User.findOne({email: email})
    if(!user){
        return res.status(404).json({"msg":"Usuário não encontrado."})
    }

    //Checar se a senha coincide
    const checkPassword = await bcrypt.compare(password,user.password)

    if(!checkPassword){
        return res.status(422).json({"msg":"A senha está incorreta."})
    }

    try{

        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id : user._id
            },
            secret,
            {
                expiresIn: '1h'
            }
        )

        res.status(200).json({"msg":"Autenticação realizada com sucesso!", token})

    }catch(error){
        return res.status(500).json({"msg":"Ocorreu um erro no servidor, tente novamente mais tarde."})
    }
}

const getUser = async (req,res)=>{
    const id = req.params.id
    let user
    //Checar se o usuário existe
    try{
        user = await User.findById(id, '-password')
    }
    catch(error){
        return res.status(404).json({"msg":"Usuário não encontrado."})
    }
    
    if(user){
    res.status(200).json({user})
    }
    else{return res.status(404).json({"msg":"Usuário não encontrado."})}
    
}

exports.register = register;
exports.login = login;
exports.getUser = getUser;