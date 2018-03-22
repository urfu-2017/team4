class User {
    constructor({ id, username, firstName, lastName, avatar }){
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatar = avatar;
    }
}

module.exports = User;