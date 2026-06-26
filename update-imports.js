const fs = require('fs');

const files = [
  'app/api/payments/verify/route.ts',
  'app/api/admin/menu/[id]/route.ts',
  'app/api/orders/route.ts',
  'app/api/menu/route.ts',
  'app/api/orders/[id]/status/route.ts',
  'app/api/admin/dashboard/route.ts'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  if (content.includes('supabaseAdmin')) {
    // If it imports both from the same line
    if (content.match(/import\s*\{[^}]*supabaseAdmin[^}]*\}\s*from\s*['"]@\/lib\/supabase['"]/)) {
      content = content.replace(
        /import\s*\{([^}]*)\}\s*from\s*['"]@\/lib\/supabase['"]/,
        (match, p1) => {
          let imports = p1.split(',').map(i => i.trim());
          if (imports.length === 1 && imports[0] === 'supabaseAdmin') {
            return `import { supabaseAdmin } from "@/lib/supabase-admin"`;
          } else {
            const others = imports.filter(i => i !== 'supabaseAdmin').join(', ');
            return `import { ${others} } from "@/lib/supabase";\nimport { supabaseAdmin } from "@/lib/supabase-admin"`;
          }
        }
      );
    }
    fs.writeFileSync(f, content);
  }
});
