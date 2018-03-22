class Message {
    constructor({ id, dialogId, senderId, text, attachments }){
        this.id = id;
        this.dialogId = dialogId;
        this.senderId = senderId;
        this.text = text;
        this.attachments = attachments;
    }
}

module.exports = Message;