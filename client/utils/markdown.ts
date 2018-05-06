import marked from 'marked';
import { createContainer } from './weather';
import { BASE_URL } from '../config';

const renderer = new marked.Renderer();

const weatherTag = /\[([a-zA-Zа-яА-ЯеёЕЁ]+)\]/g;

const stubRender = (text: string) => text;
const weatherParser = (text: string) =>
    text.replace(weatherTag, (_, city) => {
        return createContainer(city);
    });

const oldLinkRenderer = renderer.link.bind(renderer);

renderer.link = (href: string, title: string, text: string) => {
    if (href.startsWith(BASE_URL)) {
        return oldLinkRenderer(href, title, text);
    }

    return `<a target="_blank" href="${href}" ${title && `title="${title}"`}>${text}</a>`;
};

renderer.paragraph = weatherParser;
renderer.blockquote = stubRender;
renderer.html = stubRender;
renderer.heading = stubRender;
renderer.hr = stubRender;
renderer.list = stubRender;
renderer.listitem = stubRender;
renderer.table = stubRender;
renderer.tablerow = stubRender;
renderer.tablecell = stubRender;
renderer.image = stubRender;

marked.setOptions({
    breaks: true,
    gfm: true,
    renderer,
    sanitize: true,
    smartLists: false,
    smartypants: false,
    tables: false,
    pedantic: false,
    xhtml: false
});

export default marked;
