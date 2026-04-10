import { forbidden, unauthorized } from "../utils/httpErrors.js";
export function requireRole(roles) {
    return (req, _res, next) => {
        const user = req.user;
        if (!user)
            throw unauthorized();
        if (!roles.includes(user.role))
            throw forbidden();
        return next();
    };
}
