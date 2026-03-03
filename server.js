const { readFile } = require('fs').promises;


async function hello() {
    const file = await readFile('./hello.txt', 'utf-8');
    return file;
}


hello()

console.log("hello");

hello().then(result => console.log(result))