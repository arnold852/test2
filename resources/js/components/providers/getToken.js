let key = "TheMoneyCouple@2021";
var encryptor = require("simple-encryptor")(key);

export default function getToken() {
    if (encryptor.decrypt(localStorage.token) == null) {
        localStorage.token = "";
        return false;
    }
    return encryptor.decrypt(localStorage.token);
}
