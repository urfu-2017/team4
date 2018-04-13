import marked from 'marked';
import escapeHtml from './html-escape';

const renderer = new marked.Renderer();

const stubRender = text => escapeHtml(text);

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
    renderer,
    pedantic: false,
    gfm: true,
    tables: false,
    breaks: true,
    sanitize: true,
    smartLists: false,
    smartypants: false,
    xhtml: false
});


export default marked;
