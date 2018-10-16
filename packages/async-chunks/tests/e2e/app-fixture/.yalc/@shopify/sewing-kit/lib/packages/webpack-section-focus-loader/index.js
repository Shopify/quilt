"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const loader_utils_1 = require("loader-utils");
module.exports = function sectionFocusLoader() {};
module.exports.pitch = function pitch() {
  const { resourcePath } = this;
  const { focus } = loader_utils_1.getOptions(this);
  if (focus == null || focus.length === 0) {
    throw new Error('You attempted to use the section-focus-loader without setting any focused sections. Make sure you pass the `focus` option and run webpack again.');
  }
  const sectionOrSections = focus.length > 1 ? 'sections' : 'section';
  return `
// section-focus-loader

var React = require('react');

function FocusedComponent() {
  return React.createElement('div', {style: {padding: '20px', fontSize: '20px', lineHeight: '24px'}},
    React.createElement('p', {}, 'This component has been removed because you are focusing on the ${focusString(focus)} ${sectionOrSections}.'),
    React.createElement('p', {style: {marginTop: '20px'}},
      'To work on this section, restart your server without the ',
      React.createElement('code', {}, '--focus'),
      ' flag or with ',
      React.createElement('code', {}, '--focus ${sectionGroupName(resourcePath)}')
    )
  );
}

module.exports = new Proxy({}, {
  get: (_, prop) => {
    if (prop === '__esModule') {
      return true;
    }

    if (prop === 'then') {
      return Promise.resolve(FocusedComponent);
    }

    return FocusedComponent;
  },
});
  `;
};
function sectionGroupName(file) {
  const parts = file.split(path_1.sep);
  return parts[parts.findIndex(part => part === 'sections') + 1];
}
function focusString(sections) {
  if (sections.length > 2) {
    return `${sections.slice(0, sections.length - 1).join(', ')}, and ${sections[sections.length - 1]}`;
  } else if (sections.length > 1) {
    return `${sections[0]} and ${sections[1]}`;
  } else {
    return sections[0];
  }
}