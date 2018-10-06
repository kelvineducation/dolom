const createElement = function(tag, attrs, elementName) {
  const element = this.document.createElement(tag);

  Object.keys(attrs).forEach(attrName => {
    if (attrName === 'tag') {
      return;
    }

    const attr = attrs[attrName];

    if (typeof attr === 'function') {
      element.setAttribute(attrName, attr({elementName, tag, attrName, attrs}));
      return;
    }

    element.setAttribute(attrName, attr);
  });

  return element;
};

const Dolom = {
  init(document) {
    const dolom = Object.create(Dolom);

    dolom.document = document;
    dolom.templates = {};

    return dolom;
  },

  createElement(tag, attrs = {}) {
    return createElement.call(this, tag, attrs);
  },

  createElements(tags) {
    const elements = {};
    Object.keys(tags).forEach(name => {
      elements[name] = createElement.call(this, tags[name].tag, tags[name], name);
    });

    return elements;
  },

  cloneTemplate(id, selectors = {}) {
    const templateContent = this.document.querySelector(`#${id}`).content;
    const fragment = this.document.importNode(templateContent, true);

    const doms = {};
    Object.keys(selectors).forEach(key => {
      doms[key] = fragment.querySelector(selectors[key]);
    });

    return doms;
  },

  declareTemplates(templates) {
    Object.assign(this.templates, templates);
  },

  createFromTemplate(name) {
    return this.cloneTemplate(name, this.templates[name]);
  }
};

export default Dolom;
