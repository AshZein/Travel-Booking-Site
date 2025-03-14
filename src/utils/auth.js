import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME;
const JWT_REFRESH_EXPIRY_TIME = process.env.JWT_REFRESH_EXPIRY_TIME;

export function generateToken(object) {
    return jwt.sign(object, JWT_SECRET, {
      expiresIn: JWT_EXPIRY_TIME,
    });
  }
  
export function generateRefreshToken(object) {
    return jwt.sign(object, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRY_TIME,
    });
}

export function verifyToken(request){
    const authHeader = request.headers.get('Authorization');
    
    // no authorization header
    if (!authHeader) {
        console.error("No authorization header provided");
        return null;
    }

    const token = authHeader.split(' ')[1];
    // no token
    if (!token) {
        console.error("No token provided");
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error("can not verify the token");
        return null;
    }
}

export function verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      return decoded;
    } catch (error) {
      console.error("Cannot verify the refresh token");
      return null;
    }
  }