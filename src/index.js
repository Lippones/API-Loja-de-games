const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('../database/database');
const Games = require('../games/Games')
const Users = require('../users/Users');
const cors = require('cors');

const jwt = require('jsonwebtoken')
const JWTSecret = "çjnefjçawfnwaeofnçolfjwqoiprjfq~wnjfw~qnçw"

app.use(cors());
app.use(bodyParser.json());
app.use(express.json())

function auth(req,res,next){
    const authToken = req.headers['authorization'];
    if(authToken!=undefined){
        const bearer = authToken.split(' ')
        let token = bearer[1]
        jwt.verify(token, JWTSecret,(err,data)=>{
            if(err){
                res.status(401).json({error:err})
            }else{
                req.token = token;
                req.loggedUser = {
                    id:data.id,
                    email:data.email
                }
                next()
            }
        })
    }else{
        res.status(401)
        res.json({err:"invalid token"})
    }
}

async function VerifyConnection(req,res,next){
    try{
        await database.authenticate()
    }catch(err){
        res.status(500).json({error:err})
    }
    next()

}

app.get('/games', VerifyConnection,auth, async(req,res)=>{
    try{
        const result = await Games.findAll()
        res.status(200).json(result)
    }catch(err){
        res.status(500).json({error:err})
    }
    
})
app.get('/games/:id',VerifyConnection,auth,async(req,res)=>{
    const {id} = req.params
    if(isNaN(id) || id<0){
        res.status(400).json({Error: 'O id precisa ser um numero valido'})
    }else{
        try{
            const result = await Games.findByPk(id)
            if(result != null){
                res.status(200).json(result)
            }else{
                res.status(200).send()
            }
        }catch(err){
            res.status(500).json({error:err})
        }
        
    }
    
})

app.post('/games',VerifyConnection,auth,async(req,res)=>{
    const {title,year,price,image} = req.body

    if(isNaN(year) || isNaN(price) || title == ""){
        res.status(400).send()
    }else{
        try{
            await Games.create({
                title,
                year,
                price,
                image
            })
            res.status(201).send()
        }catch{
            res.status(400).send()
        }
    }
})
app.put('/games',VerifyConnection,async(req,res)=>{
    const {id,title,year,price,image} = req.body
    if(isNaN(year) || isNaN(price) || title == ""){
        res.status(400).send()
    }else{
        try{
            await Games.update({
                title,
                year,
                price,
                image
            },{
                where:{
                    id
                }
            })
            res.status(200).send()
        }catch{
            res.status(400).send()
        }
    }

})
app.patch('/games',VerifyConnection,auth,async(req,res)=>{
    const {id,price} = req.body

    if(isNaN(price) || isNaN(id)){
        res.status(400).send()
    }else{
        try{
            await Games.update({
                price
            },{
                where:{
                    id
                }
            })
            res.status(200).send()
        }catch{
            res.status(400).send()
        }
    }
})



app.delete('/games/:id',VerifyConnection,auth,async(req,res)=>{
    const {id} = req.params;
    if(isNaN(id)){
        res.status(400).send()
    }else{
        try{
            await Games.destroy({
                where:{
                    id
                }
            })
            res.status(200).send()
        }catch{
            res.status(400).send()
        }
    }
    
})
app.post('/auth',VerifyConnection,async(req,res)=>{
    const {email,password} = req.body
    if(email != undefined){
        const user = await Users.findOne({
            where:{
                email
            }
        })

        if(user!= undefined){
            if(user.password == password){
                jwt.sign({id:user.id,email:user.email,name:user.name}, JWTSecret, {expiresIn:'1d'},(err, token)=>{
                    if(err){
                        res.status(400).json({error:err})
                    }else{
                        res.status(200).json({token})

                    }
                })
            }else{
                res.status(404).json({error:"password incorrect"})
            }
        }else{
            res.status(401).json({error:"user not found"})
        }
    }else{
        res.status(400).json({error:"Email invalido"})
    }
})
app.post('/user',VerifyConnection,auth,async(req,res)=>{
    const {name,email,password} = req.body
    if(email == undefined || password == undefined){
        res.status(400).send()
    }else{
        try{
            await Users.create({
                name,
                email,
                password
            })
            res.status(201).send()
        }catch{
            res.status(400).send()
        }
    }
})

app.listen(3333,()=>{
    console.log("Server running on port 3333")
})
