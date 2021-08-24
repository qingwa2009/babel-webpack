const presets = [
    [
        "@babel/env",
        {
            targets: {
                edge: "12",
                firefox: "26",
                chrome: "19",
                safari: "9",
            },
            // useBuiltIns: "usage",
            debug: true,
        },
    ],
];
const plugins = [
    ["@babel/plugin-transform-runtime",
        {
            "absoluteRuntime": true,
            "corejs": 3,
            // "helpers": true,
            // "regenerator": true,
            // "version": "7.0.0-beta.0"
        }
    ]
];
module.exports = { presets, plugins };