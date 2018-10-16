"use strict";

const React = require('react');
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    const { whyDidYouUpdate } = require('why-did-you-update');
    whyDidYouUpdate(React);
}