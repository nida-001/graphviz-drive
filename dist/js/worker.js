"use strict";importScripts("../lib/viz.1.3.0.js"),onmessage=function(s){var t=Viz(s.data.src,s.data.options);postMessage(t)};
