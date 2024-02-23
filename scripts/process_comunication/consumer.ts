import { createWriteStream } from 'fs';

const pipe = createWriteStream('mypipe');
const pipe2 = createWriteStream('mypipe2');
pipe.write('0x05b86730f7c6eaad9c5ab0fe4b534c8f681810e6429cfc789570351853c95388');
pipe2.write('0x05b86730f7c6eaad9c5ab0fe4b534c8f681810e6429cfc789570351853c95388');
pipe.end();
pipe2.end();