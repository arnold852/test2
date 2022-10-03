let key = "TheMoneyCouple@2021";
var encryptor = require("simple-encryptor")(key);

export default function getUserData() {
    if (encryptor.decrypt(localStorage.userdata) == null) {
        localStorage.storage = "";
        return false;
    }
    return encryptor.decrypt(localStorage.userdata);
}
