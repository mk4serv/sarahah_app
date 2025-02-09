import Joi from "joi";

export const SignUpSchema = {
    body: Joi.object({
        username: Joi.string().min(4).max(20).alphanum().required(),
        email: Joi.string().email({
            tlds: {
                allow: ['com', 'net', 'org']
            },
            maxDomainSegments: 2
        }).required().regex(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/),
        password: Joi.string().min(8).required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        phone: Joi.string().required(),
        age: Joi.number().required()
    })
}