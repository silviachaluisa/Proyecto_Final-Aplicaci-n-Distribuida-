import { check, validationResult } from "express-validator";

export const chatValidator = [
    check("name", "El nombre es obligatorio").not().isEmpty(),

    check("name")
        .customSanitizer((value) => value.trim())
        .isLength({ min: 3, max: 30 })
            .withMessage("El nombre debe tener entre 3 y 30 caracteres"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];