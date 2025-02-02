import { check, validationResult } from "express-validator";

export const userRegisterValidator = [
    check(["name", "email", "password"], "Todos los campos son obligatorios").not().isEmpty(),

    check("name")
        .customSanitizer((value) => value.trim())
        .isLength({ min: 3, max: 50 })
            .withMessage("El nombre debe tener entre 3 y 50 caracteres"),

    check("email")
        .customSanitizer((value) => value.trim())
        .isEmail()
            .withMessage("El email no es válido"),

    check("password")
        .customSanitizer((value) => value.trim())
        .isLength({ min: 8, max: 255 })
            .withMessage("La contraseña debe tener entre 6 y 255 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/)
            .withMessage('El campo "contraseña" debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];