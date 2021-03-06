const { curry } = require('lodash/fp');

const isType = curry((type, node) => node.type === type);

const isMdxBlockElement = curry(
  (name, node) => isType('mdxBlockElement', node) && node.name === name
);

const isMdxSpanElement = curry(
  (name, node) => isType('mdxSpanElement', node) && node.name === name
);

const isMdxElement = curry(
  (name, node) => isMdxBlockElement(name, node) || isMdxSpanElement(name, node)
);

const hasOnlyChild = curry(
  (name, node) => node.children.length === 1 && isType(name, node.children[0])
);

const flatten = (node) => {
  node.children = node.children[0].children;
};

const hasAttribute = curry((attribute, node) =>
  node.attributes.some((attr) => attr.name === attribute)
);

const findAttribute = (attributeName, node) => {
  if (!node.attributes) {
    return null;
  }
  const attribute = node.attributes.find((attr) => attr.name === attributeName);
  return attribute ? attribute.value : null;
};

const hasClassName = (className, node) => {
  if (!node.attributes) {
    return false;
  }
  return node.attributes.some(
    (attr) =>
      attr.name === 'className' &&
      attr.value.split(/\s+/).some((cn) => cn === className)
  );
};

const setAttribute = (name, value, node) => {
  const attribute = findAttribute(name, value);

  if (attribute) {
    attribute.value = value;
  } else {
    addAttribute(name, value, node);
  }
};

const removeAttribute = curry((attribute, node) => {
  const idx = node.attributes.findIndex((attr) => {
    return typeof attribute === 'function'
      ? attribute(attr)
      : attr.name === attribute;
  });

  if (idx !== -1) {
    node.attributes.splice(idx, 1);
  }
});

const addAttribute = curry((name, value, node) => {
  node.attributes.push({
    name,
    value,
    type: 'mdxAttribute',
  });
});

const removeChild = curry((child, parent) => {
  const idx = parent.children.indexOf(child);

  if (idx !== -1) {
    parent.children.splice(idx, 1);
  }
});

const isPlainText = (node) => {
  return (
    node.children.every((node) => node.type === 'text') ||
    (node.children.length === 1 &&
      node.children[0].type === 'paragraph' &&
      isPlainText(node.children[0]))
  );
};

module.exports = {
  addAttribute,
  flatten,
  isMdxBlockElement,
  isMdxElement,
  isMdxSpanElement,
  isPlainText,
  hasAttribute,
  findAttribute,
  hasClassName,
  hasOnlyChild,
  removeAttribute,
  removeChild,
  isType,
  setAttribute,
};
