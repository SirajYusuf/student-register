const path = require('path')
const fs = require('fs')
const Student = require('../models/studentModel')
const {emptyS3Directory, emptyDirectory} = require('../utils/multer')

const register = async(req,res)=>{
    try{
        const student  = new Student({
            studentName: req.body.studentName,
            emailId:req.body.emailId,
            mobileNumber:req.body.mobileNumber
        })
        await Student.create(student).then((data)=>{
            res.status(201).send({
                status: 201,
                message:"successfully created",
                data
            })
        })
    }catch(err){
        console.log(err.message)
        res.status(500).send({
            status: 500,
            message:"Something went wrong please try again",
            err: err.message
        })
    }
}

const uploadPic = async(req,res)=>{
try{
    const files = req.files
    const pics = files.map(item => {
        const container = {};
        container.key= item.key;
        container.location= item.location;
        return container;
    })
    await Student.findOneAndUpdate({_id:req.params.id},{$push:{picNames:files}}).then(()=>{
        res.status(200).send({
            status:200,
            message:'Images were successfully uploaded'
        })
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

const viewPic = async(req,res)=>{
try{
    const id = req.params.id
    const picName = req.body.picName
    fs.readFile(`uploads/${id}/${picName}`, function(err, data) {
        if (err){
            console.log(err)
            res.send('somthing went wrong please try again')
            }
        else{
            res.set('Content-type','image/png')
            res.status(200).send(data)
    }})
}catch(err){
    console.log(err)
    res.status(500).send({
            status:500,
            message:'Something went wrong please try again!',
            err: err.message
    })
    }
}

const getStudent = async(req,res)=>{
    try{
        await Student.find({}).then((data)=>{
            res.status(200).send({
                status:200,
                message:'Success',
                data
            })
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
                status:500,
                message:'Something went wrong please try again!',
                err: err.message
        })
    }
  
}

const updateStudent = async(req,res)=>{
    const student = await Student.findOne({_id:req.params.id})
    const updates = Object.keys(req.body)
    const allowedUpdates = ['studentName', 'emailId', 'mobileNumber']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({
            error : 'Invalid updates!'
        })
    }
    try{ 
        updates.forEach((update) => {
            student[update] = req.body[update]
        })   
        await student.save().then((data)=>{
            res.status(200).send({
                status:200,
                message:'success',
                data
            })
        })
        
    }catch(err){
        console.log(err)
        res.status(500).send({
                status:500,
                message:'Something went wrong please try again!',
                err: err.message
        })
    }
}

const deleteStudent = async(req,res)=>{
try{    
        await Student.findByIdAndDelete({_id:req.params.id}).then(async(data)=>{
           await emptyDirectory('studentregister',`${req.params.id}`)
           res.send(data)
         })
}catch(err){
        console.log(err)
        res.status(500).send({
                status:500,
                message:'Something went wrong please try again!',
                err: err.message
        })
}
}

const updatePic = async(req,res)=>{
    try{
        const files = req.files
        const pics = files.map(item => {
            const container = {};
            container.key= item.key;
            container.location= item.location;
            return container;
        })
        const _id =  req.params.id
        const pull = await Student.findByIdAndUpdate(_id,{$pull:{'picNames':{_id:req.params.id2}}})
        const push = await Student.findByIdAndUpdate(_id,{$push:{picNames:files}})
        console.log(pull,push)
        if(!pull || !push) throw new Error('somthing went wrong')
        res.status(200).send({
            status:200,
            message:'Image successfully updated'
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            status:500,
            message:'something went wrong please try agian'
        })
    }
}

module.exports = {
    register,
    uploadPic,
    viewPic,
    getStudent,
    updateStudent,
    deleteStudent,
    updatePic
}