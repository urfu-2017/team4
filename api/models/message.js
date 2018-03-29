class Message {
    constructor({ id, senderName, text, attachments }){
        this.id = id;
        this.senderName = senderName;
        this.text = text;
        this.attachments = attachments;
    }
}

module.exports = Message;
