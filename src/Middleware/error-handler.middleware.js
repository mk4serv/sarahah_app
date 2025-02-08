export const errorHandlerMiddleware = (api) => {
    return (req, res, next) => {

        api(req,res,next).catch((error) => {
            console.log(`Error in ${req.url} From Error Handler Middleware `, error);
            return next(new Error(error.message, { cause:500 }));
        })
    }
}

export const globalErrorHandlerMiddleware = (error, req, res, next) => {
    console.log(`Global Error Handler Middleware : ${error.message} `);
    return res.status(500).json({ message: "Something went wrong", err: error.message });
}