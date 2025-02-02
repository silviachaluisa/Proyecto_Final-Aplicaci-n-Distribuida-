import { check, validationResult } from "express-validator";

export const messageValidator = [
    check("content", "El contenido del mensaje es obligatorio").not().isEmpty(),

    check("content")
        .customSanitizer((value) => value.trim())
        .isLength({ min: 1, max: 255 })
            .withMessage("El contenido del mensaje debe tener entre 1 y 255 caracteres"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];