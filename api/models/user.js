'use strict';

class User {
    constructor({ username, firstName, lastName, avatar, bio, profileUrl }) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatar = avatar;
        this.bio = bio;
        this.profileUrl = profileUrl;
    }
}

module.exports = User;
