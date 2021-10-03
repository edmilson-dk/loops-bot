const fs = require('fs');

const paths = [
  "./musics",
];

paths.forEach(path => {
  fs.mkdirSync(path, { recursive: true });
  fs.writeFileSync(`${path}/file.txt`, `void`);
});