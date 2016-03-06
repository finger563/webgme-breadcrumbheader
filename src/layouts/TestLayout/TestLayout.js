/*globals define, WebGMEGlobal, $ */
define([
    'js/Layouts/DefaultLayout/DefaultLayout',
    'text!./TestLayoutConfig.json'
], function(
    DefaultLayout,
    LayoutConfigJSON
) {
    'use strict';
    
    var CONFIG = JSON.parse(LayoutConfigJSON);

    var TestLayout = function(params) {
        params = params || {};
        params.panels = CONFIG.panels;
        DefaultLayout.call(this, params);
    };

    TestLayout.prototype = new DefaultLayout();

    return TestLayout;
});
