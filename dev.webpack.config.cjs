const exec = require('child_process').exec;

const { merge } = require('webpack-merge')
const prod = require('./webpack.config.cjs')

module.exports = merge(prod, {
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    watchOptions: {
        ignored: ["node_modules", "dist"],
        aggregateTimeout: 600,
    },
    plugins: [
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    exec('./assemble.sh', (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                });
                /*compiler.hooks.beforeCompile.tap("BeforeCompilePlugin", () => {
                    exec('rm -rf dist', (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                })*/
            }
        }
    ]
})