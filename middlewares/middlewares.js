const error_h = require("./Error/error_class.js");
const file_model =  require("../models/file_information_model.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const path_builder = function(file_name, id){
    const extension = file_name.split(".").pop();
    let loc = '';
    if(extension === "txt" || extension === "docx" || extension === "pdf" || extension === "pptx" || extension === "rtf"){
        loc += `${id}/documents/${file_name}`;
    }
    else if(extension === "mp4" || extension === "mov" || extension === "mkv" || extension === "avi"){
        loc += `${id}/videos/${file_name}`;
    }
    else if(extension === "png" || extension === "jpeg" || extension === "jpg" || extension === "bmp" || extension === "ico"){
        loc += `${id}/images/${file_name}`;
    }
    else{
        loc += `${id}/other/${file_name}`;
    }
    return loc.toString();
}

exports.save_file_data = async (req,res,next) => {
    const {file_name, file_size, file_description, file_mime, file_category} = req.body;
    if(file_description.length > 100 || file_category.length > 50){
        return next(new error_h("Description and category too large", 500));
    }
    const storage_path = path_builder(file_name, res.locals.uid);
    try{
        if(file_category.trim() === ''){
            const file_add = await file_model.create({uploaded_file_owner: res.locals.uid, uploded_file_name: file_name, uploaded_file_description: file_description, uploaded_file_size: file_size, uploaded_file_storage_location: storage_path});
        }
        else{
            const file_add = await file_model.create({uploaded_file_owner: res.locals.uid, uploded_file_name: file_name, uploaded_file_description: file_description, uploaded_file_size: file_size, uploaded_file_storage_location: storage_path, uploaded_file_category: file_category});
        }
        res.locals.store_path = storage_path;
        res.locals.ftype = file_mime;
        next();
    }
    catch(e){
        return next(new error_h(`Error: ${e}`, 500));
    }
}

exports.delete_file_data = async (req,res,next) => {
    const {main_key} = req.body;
    const del_path = path_builder(main_key, res.locals.uid);
    try{
        const delete_document = await file_model.deleteOne({uploaded_file_storage_location: del_path});
        res.locals.del_location = del_path;
        next();
    }
    catch(e){
        return next(new error_h(`Error: ${e}`, 500));
    }
}

exports.check_cookie = async (req,res,next) => {
    const user_id = req.cookies.uid;
    if(!user_id){
       return next(new error_h("Please login first", 400));
    }
    else{
        try{
            const verify = jwt.verify(user_id, process.env.sessionKey);
            res.locals.uid = verify.u_id;
            next();
        }
        catch(e){
            return next(new error_h("Login again please", 400));
        }
    }
}
exports.sanitize_signup = async (req,res,next) => {
    const {name, email, password} = req.body;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/;
    if((name.trim() === '' || name.length > 12) || email.trim() === '' || !regex.test(password.trim())){
        return next(new error_h("Invalid or empty fields", 400));
    }
    else{
        next();
    }
}

exports.sanitize_login = async (req,res,next) => {
    const {email, password} = req.body;
    if((password.trim() === '' || password.length > 12) || email.trim() === ''){
        return next(new error_h("Invalid or empty fields", 400));
    }
    else{
        next();
    }
}


exports.sanitize_inputs = async(req,res,next) => {
    const {file_name, file_size, file_description, file_mime} = req.body;
    const ext = file_name.split(".").pop()
    if( (file_name.trim() === '' || file_name.includes('.')) &&  file_description.trim() === ''){
        return next(new error_h("File name and description required, no extensions",400));
    }
    if(file_mime === 'application/x-msdownload' ||
       file_mime === 'application/x-zip-compressed' ||
       file_mime === 'application/hta' ||
       file_mime === 'application/x-compressed' ||
       file_mime === 'text/javascript' ||
       (ext === 'bat' || ext === 'psl')
       )
    {
        return next(new error_h("File type is not supported",400));
    }
    if((file_size/1024 ** 2) > 50){
        return  next(new error_h("Max file size is 50 mb",400));
    }
    next();

}