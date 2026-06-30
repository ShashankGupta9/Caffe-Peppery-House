const fs = require('fs');
const content = fs.readFileSync('seed-db.js', 'utf8');
const match = content.match(/const products = (\[[\s\S]*?\]);/);
if(match) {
  let p = match[1];
  let items = eval(p);
  items = items.map((i, idx) => {
    return Object.assign({}, i, {
      id: 'mock-' + idx,
      category_id: 'cat-' + i.category,
      created_at: new Date().toISOString()
    });
  });
  const fileContent = 'import { MenuItem } from "../types";\n\nexport const MOCK_MENU_ITEMS: MenuItem[] = ' + JSON.stringify(items, null, 2) + ';';
  fs.writeFileSync('lib/mockData.ts', fileContent);
  console.log('Created lib/mockData.ts');
} else {
  console.log('Could not parse');
}
