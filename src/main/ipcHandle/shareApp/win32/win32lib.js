// const helloPath = path.join(__dirname, '../build/Release/hello.node');
// const helloPath = path.join(__dirname, '../../../../../build/Release/hello.node');
// // const helloPath = path.join(__dirname, '../bin/win32-x64-116/shareDesktop.node');

// export const hello = __non_webpack_require__(helloPath);
export const winSimulator = __non_webpack_require__(`./winSimulator.node`);

// export const hello = require('electron').remote.require(helloPath);