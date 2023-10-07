const builder = require('electron-builder');

// npx electron-builder --win --x64 --dir
builder.build({
    config: {
        appId: "impromptu",
        productName: "impromptu",
        files: [
            "dist/*"
        ],
        directories: {
            output: "product"
        },
        win:{
            target: "dir"
        }
    }
});
