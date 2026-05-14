const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'app'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('color: palette.card')) {
    content = content.replace(/color:\s*palette\.card/g, "color: '#fff'");
    fs.writeFileSync(file, content);
    console.log('Fixed color: palette.card in', path.basename(file));
  }
}
