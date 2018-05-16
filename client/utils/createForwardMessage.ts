export default function(message: any, isReply: boolean = false) {
    const { senderId, attachment, text, createdAt } = message;
    return { senderId, attachment, text, isReply, createdAt };
}
