class ExpressError extends Error {
    constructor(statusCode = 500, message = "Something went wrong") {
        super(ExpressError);
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = ExpressError;