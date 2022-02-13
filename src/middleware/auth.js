const jwt = require("jsonwebtoken")
const Admin=require('../models/adminModel')

const auth = async (req, res,next) => {
    try{
    const token = req.header('Authorization')
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        })
    }
    const decode=jwt.verify(token, process.env.SECRET)
    const admin= await Admin.findOne({_id:decode.id})
    if (!admin || !admin.role) {
        throw new Error('You are not authorized to perform this action')
    }
        req.role = decode.role
        req.id = decode.id
        req.admin=admin
        next()
}
catch (err) {
    console.log(err)
    res.status(401).send({ 
        status:401,
        message:"Session Timed Out.Please login again"
     })
}
}

module.exports = auth