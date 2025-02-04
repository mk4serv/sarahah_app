import cryptoJs from "crypto-js";

export const Encryption = ({ value, secretKey } = {}) => {
    return cryptoJs.AES.encrypt(JSON.stringify(value), secretKey).toString();
}

export const Decryption = ({ chiper, secretKey } = {}) => {
    return cryptoJs.AES.decrypt(chiper, secretKey).toString(cryptoJs.enc.Utf8);
}