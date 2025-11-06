const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build da ONG Platform...');

// Verificar se os arquivos necessários existem
const requiredFiles = [
  'index.html',
  'projetos.html', 
  'cadastro.html',
  'css/style.css',
  'js/app.js',
  'js/validacao.js'
];

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(❌ Arquivo necessário não encontrado: ${file});
    process.exit(1);
  }
});

console.log('✅ Todos os arquivos necessários encontrados');

// Scripts de otimização
const buildSteps = [
  { name: 'Minificando CSS...', command: 'npx cleancss -o css/style.min.css css/style.css' },
  { name: 'Minificando JavaScript...', command: 'npx uglifyjs js/app.js -o js/app.min.js -c -m && npx uglifyjs js/validacao.js -o js/validacao.min.js -c -m' }
];

function runBuildStep(step, index) {
  console.log(\n📦 ${step.name});
  
  exec(step.command, (error, stdout, stderr) => {
    if (error) {
      console.error(❌ Erro no passo ${index + 1}:, error);
      return;
    }
    
    console.log(✅ Passo ${index + 1} concluído);
    
    if (index < buildSteps.length - 1) {
      runBuildStep(buildSteps[index + 1], index + 1);
    } else {
      console.log('\n🎉 Build concluído com sucesso!');
      console.log('📊 Estatísticas:');
      console.log('   - CSS minificado: css/style.min.css');
      console.log('   - JavaScript minificado: js/app.min.js, js/validacao.min.js');
      console.log('   - Projeto pronto para produção!');
    }
  });
}

// Iniciar o processo de build
runBuildStep(buildSteps[0], 0);
