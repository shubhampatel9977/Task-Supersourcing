const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

async function generateToken(id) {
  try {
    const payload = { user: id };
    const options = { expiresIn: "24h" };

    return jwt.sign(payload, jwtSecret, options);
  } catch (error) {
    throw new Error("Error generate token");
  }
}

async function authUser(req, res, next) {
  try {
    const bearerToken = req.header("Authorization");

    if (!bearerToken) {
      return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    const token = bearerToken.split(" ");

    jwt.verify(token[1], jwtSecret, (err, data) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden - Invalid token" });
      }
      req.body.user = data.user
      next();
    });
  } catch (error) {
    throw new Error("Error authenticate token");
  }
}

module.exports = { generateToken, authUser };
