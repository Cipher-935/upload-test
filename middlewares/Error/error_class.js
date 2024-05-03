class CustomError extends Error{
    constructor(mess,code){
        super(mess);
        this.status = code;
        // Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = CustomError;