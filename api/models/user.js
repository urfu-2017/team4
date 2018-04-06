'use strict';

class User {
    constructor({ username, firstName, lastName, avatar }) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatar = avatar;
    }
}

module.exports = User;
