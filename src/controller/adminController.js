const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/adminModel')

const login = async(req,res)=>{
    try{
        const admin = await Admin.findOne({email: 'sirajygs@gmail.com'})
        if (!admin) {
            return res.status(400).send({
                status: 400,
                message: "Unable to find email."
            })
        }
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            admin.password
        )
        if (!passwordIsValid) {
            return res.status(400).send({
                status: 400,
                message: "Invalid Password!"
            })
        }
        var token = jwt.sign({ id: admin.id, role: admin.role }, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
        })
        console.log(token)
        admin.set('token',token)
        res.status(200).send({
            status: 200,
            Message: "Login successful",
            Data: admin
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            status:500,
            message:"Something went wrong please try again",
            err: err.message
        })
    }
   
}

module.exports = login