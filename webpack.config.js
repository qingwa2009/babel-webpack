const path = require("path");
const fs = require("fs");

const srcFolder = "D:/documents/MyCodes/mywebsiteProject/mywebsite";
const destFolder = "D:/documents/MyCodes/mywebsiteProject/mywebsite-es5";

const ignoreReg = [/^.git$/, /^.vscode$/, /^node_modules$/];

function isIgnore(s) {
    for (const reg of ignoreReg) {
        if (reg.test(s)) return true;
    }
    return false;
}

function getAllJsFile(folder, out_arr) {
    const ss = fs.readdirSync(folder);
    for (const s of ss) {
        const f = path.resolve(folder, s);
        const ls = fs.lstatSync(f);
        if (ls.isDirectory() && (!isIgnore(s))) {
            getAllJsFile(f, out_arr);
        } else {
            const ext = path.extname(f).toLowerCase();
            if (ext === ".js") {
                out_arr.push(f);
            } else {

                if (!isIgnore(s)) {
                    const dest = path.resolve(destFolder, path.relative(srcFolder, f));
                    const dir = path.dirname(dest);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    if (ext === ".html") {
                        //移除html文件内type="module"
                        fs.readFile(f, "utf8", (err, data) => {
                            if (err) {
                                console.warn(err);
                                return;
                            }
                            data = data.replace(/type\s*=\s*["|']module["|']/g, () => {
                                console.log(`type="module" has been removed in ${f}`);
                                return "";
                            });

                            fs.writeFile(dest, data, (err) => {
                                if (err) console.warn("write html file failed: ", err);
                            });
                        })
                    } else {
                        //copy direct        
                        fs.copyFileSync(f, dest);
                    }
                    console.log(dest);
                }
            }
        }
    }
}

const jss = [];
getAllJsFile(srcFolder, jss)
console.log(jss);

const rjss = [];
for (const s of jss) {
    rjss.push(path.relative(srcFolder, s));
}
console.log(rjss);



module.exports = {
    target: ['web', 'es5'],
    entry: () => {
        const e = {};
        for (let i = 0; i < jss.length; i++) {
            e[rjss[i]] = jss[i];
        }
        return e;
    },
    output: {
        filename: (...args) => args[0].chunk.name,
        path: destFolder,
        // publicPath: "/",
        environment: {
            arrowFunction: false,
        },
        // clean: true,
    },
    resolve: {
        modules: [path.resolve(__dirname, "node_modules")],
        // preferRelative: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    edge: "79",
                                    firefox: "63",
                                    chrome: "67",
                                    safari: "11",
                                },
                                // useBuiltIns: "usage",
                                debug: true,
                            }],
                        ],
                        plugins: [
                            ['@babel/plugin-transform-runtime', {
                                corejs: 3,
                                // absoluteRuntime: true,
                            }],
                        ],
                    }
                }
            },
            {   /**替换import.meta.url */
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: path.resolve("./MyImportMetaURLLoader.js"),
                    options: {
                        root: srcFolder,
                    }
                }
            },

        ]
    }
};