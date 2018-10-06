import test from 'tape';
import jsdom from 'jsdom';
import Dolom from '../src/main.js';
import util from 'util';

test('element can be created with attributes', async t => {
  t.plan(3);

  const document = new jsdom.JSDOM().window.document;
  const dolom = Dolom.init(document);

  const element = dolom.createElement('a', {
    href: '/hello#dolom',
    id: ({tag, attrName, attrs}) => `${tag}:${attrs.href}:${attrName}`
  });

  t.equals(element.tagName, 'A');
  t.equals(element.getAttribute('href'), '/hello#dolom');
  t.equals(element.id, 'a:/hello#dolom:id');
});

test('named elements can be created with attributes', async t => {
  t.plan(5);

  const document = new jsdom.JSDOM().window.document;
  const dolom = Dolom.init(document);

  const id = ({elementName}) => `dolom-${elementName}`;
  const elements = dolom.createElements({
    container: {tag: 'div', id},
    iframe: {tag: 'iframe', id, width: 300, height: 200, src: '/hello'},
  });

  t.equals(elements.container.tagName, 'DIV');
  t.equals(elements.container.id, 'dolom-container');

  t.equals(elements.iframe.tagName, 'IFRAME');
  t.equals(elements.iframe.id, 'dolom-iframe');
  t.equals(elements.iframe.getAttribute('src'), '/hello');
});

test('template tag can be cloned', async t => {
  t.plan(7);

  const document = new jsdom.JSDOM(
    `
    <template id="dolom-test-template">
      <div class="container">
        <h1>Hi there</h1>
        <p class="description">This is some content</p>
      </div>
    </template>
    `
  ).window.document;

  const dolom = Dolom.init(document);
  const cloned = dolom.cloneTemplate('dolom-test-template', {
    container: '.container',
    header: '.container h1',
    description: '.description'
  });

  t.equals(cloned.container.tagName, 'DIV');
  t.equals(cloned.container.className, 'container');

  t.equals(cloned.header.tagName, 'H1');
  t.equals(cloned.header.textContent, 'Hi there');

  t.equals(cloned.description.tagName, 'P');
  t.equals(cloned.description.className, 'description');
  t.equals(cloned.description.textContent, 'This is some content');
});

test('declared templates can be used', async t => {
  t.plan(7);

  const document = new jsdom.JSDOM(
    `
    <template id="dolom-test-template">
      <div class="container">
        <h1>Hi there</h1>
        <p class="description">This is some content</p>
      </div>
    </template>
    `
  ).window.document;

  const dolom = Dolom.init(document);
  dolom.declareTemplates({
    'dolom-test-template': {
      container: '.container',
      header: '.container h1',
      description: '.description'
    }
  });

  const template = dolom.createFromTemplate('dolom-test-template');

  t.equals(template.container.tagName, 'DIV');
  t.equals(template.container.className, 'container');

  t.equals(template.header.tagName, 'H1');
  t.equals(template.header.textContent, 'Hi there');

  t.equals(template.description.tagName, 'P');
  t.equals(template.description.className, 'description');
  t.equals(template.description.textContent, 'This is some content');
});
