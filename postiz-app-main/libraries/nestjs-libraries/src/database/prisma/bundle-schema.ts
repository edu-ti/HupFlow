import * as fs from 'fs';
import * as path from 'path';

const PRISMA_DIR = __dirname;
const SCHEMA_DIR = path.join(PRISMA_DIR, 'schema');
const OUTPUT_FILE = path.join(PRISMA_DIR, 'schema.prisma');

export function bundlePrismaSchema(): void {
  console.log('[Prisma Bundle] Iniciando consolidação do schema modular...');

  if (!fs.existsSync(SCHEMA_DIR)) {
    console.error(`[Prisma Bundle] Erro: Diretório ${SCHEMA_DIR} não encontrado.`);
    process.exit(1);
  }

  const schemaFiles = fs
    .readdirSync(SCHEMA_DIR)
    .filter((file) => file.endsWith('.prisma'))
    .sort();

  if (schemaFiles.length === 0) {
    console.error(`[Prisma Bundle] Erro: Nenhum arquivo .prisma encontrado em ${SCHEMA_DIR}.`);
    process.exit(1);
  }

  console.log(`[Prisma Bundle] Arquivos de domínio encontrados (${schemaFiles.length}):`);
  schemaFiles.forEach((file) => console.log(`  - ${file}`));

  let consolidatedContent = `// ============================================================================\n`;
  consolidatedContent += `// ATENÇÃO: ARQUIVO GERADO AUTOMATICAMENTE VIA SCHEMA MODULAR (GAP-MOD-02)\n`;
  consolidatedContent += `// Para editar modelos, edite os arquivos correspondentes em:\n`;
  consolidatedContent += `// ./schema/*.prisma e execute "pnpm run prisma-bundle"\n`;
  consolidatedContent += `// ============================================================================\n\n`;

  let totalModels = 0;
  let totalEnums = 0;

  for (const file of schemaFiles) {
    const filePath = path.join(SCHEMA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Count models and enums
    const modelMatches = content.match(/^model\s+\w+/gm) || [];
    const enumMatches = content.match(/^enum\s+\w+/gm) || [];

    totalModels += modelMatches.length;
    totalEnums += enumMatches.length;

    consolidatedContent += `\n// ----------------------------------------------------------------------------\n`;
    consolidatedContent += `// Domain Section: ${file}\n`;
    consolidatedContent += `// ----------------------------------------------------------------------------\n\n`;
    consolidatedContent += content.trim() + '\n';
  }

  fs.writeFileSync(OUTPUT_FILE, consolidatedContent, 'utf-8');

  console.log(`[Prisma Bundle] ✅ Schema consolidado com sucesso em ${OUTPUT_FILE}`);
  console.log(`[Prisma Bundle] Total de Modelos: ${totalModels} | Total de Enums: ${totalEnums}`);
}

// Execução direta
if (require.main === module) {
  bundlePrismaSchema();
}
