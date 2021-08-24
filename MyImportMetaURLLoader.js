const loaderUtils = require('loader-utils');

module.exports = function (source) {
    const root = loaderUtils.getOptions(this).root;
    if (!root) {
        console.warn("MyImportMetaURLLoader has not option 'root'");
        return source;
    }
    const req = loaderUtils.getCurrentRequest(this);
    const root1 = root.replace(/\\/g, "/");
    const req1 = req.replace(/\\/g, "/");
    const ind = req1.toLowerCase().indexOf(root1.toLowerCase());
    if (ind === -1) return source;
    const rel = req1.substr(ind + root1.length);
    const s = `location.origin + "${rel}"`;
    console.log(`import.meta.url replace to [${s}] in [${rel}]`);
    source = source.replace(/import.meta.url/g, s);
    return source;
}