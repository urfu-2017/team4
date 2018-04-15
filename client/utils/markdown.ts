import marked from 'marked';
import { createContainer } from './weather';

const renderer = new marked.Renderer();

const stubRender = text => text;

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

const oldLinkRender = renderer.link.bind(renderer);

renderer.link = (href, title, text) => {
    if (href === 'weather') {
        return createContainer(text);
    }

    return oldLinkRender(href, title, text);
};

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
