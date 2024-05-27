import {jwtDecode} from "jwt-decode";
/**
 * Middleware to check if user has logged in
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
export const userAuthenticated = async (req, res, next) => {
  if (req.user) {
    if (req.user._id) {
      return next();
    } else if (req.user.token) {
      let decodedToken = jwtDecode(req.user.token);
      req.user._id = decodedToken.userId;
      return next();
    }
  }
  return res.status(401).json({ status: false, message: "Unauthorized User!!!" });
};