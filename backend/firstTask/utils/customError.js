class userError extends Error {
    constructor(message, statusCode){
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode; //status code
    }
}
class validatorError extends Error {
    constructor(message, statusCode){
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode; //status code
    }
}
class projectError extends Error{
    constructor(message, statusCode){
        super(message)
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}
module.exports = { userError, validatorError, projectError }