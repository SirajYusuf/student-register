const mongoose = require('mongoose')
const validator = require('validator')

const schema = new mongoose.Schema({
    studentName:{
        type: String,
        required: true,
        trim: true,
        minlength:4,
        maxlength:25,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error('Student name should should have 4-25 characters with no numbers or special characters')
            }
        }
    },
    emailId:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    mobileNumber: {
        type:Number,
        required:true,
        validate: {
            validator: function(val) {
                return val.toString().length === 10
            },
            message: val => `${val.value} has to be 10 digits`
        }
    },
    picNames: [{
        key:{
            type:String
        },
        location:{
            type:String
        }
    }]
},{
    timestamps: true
})

const Student = mongoose.model('Student', schema,'student')

module.exports= Student