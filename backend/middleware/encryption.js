const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.ENCRYPTION_KEY || "default-secret-key";

const decryptRequest = (req, res, next) => {
  if (req.body && req.body.encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(req.body.encryptedData, SECRET_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      req.body = decryptedData;
    } catch (error) {
      return res.status(400).json({ error: "Invalid encrypted data" });
    }
  }
  next();
};

const encryptResponse = (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    if (typeof data === "object") {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET_KEY
      ).toString();
      originalSend.call(this, { encryptedData });
    } else {
      originalSend.call(this, data);
    }
  };
  next();
};

module.exports = { decryptRequest, encryptResponse };
