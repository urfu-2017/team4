export default function findMentions(messageText: string): string[] {
    return (messageText.match(/@\w+/g) || [])
        .map(mention => mention.slice(1).toLowerCase());
}
