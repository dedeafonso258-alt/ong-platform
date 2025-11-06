const fs = require('fs');
const path = require('path');

console.log('🖼  Otimizando imagens...');

// Lista de imagens para otimizar (exemplo)
const imagesToOptimize = [
  'images/hero-image.jpg',
  'images/about-image.jpg', 
  'images/projeto-educacao.jpg',
  'images/projeto-alimentacao.jpg',
  'images/projeto-oficina.jpg',
  'images/projeto-educacao-detail.jpg',
  'images/projeto-alimentacao-detail.jpg',
  'images/projeto-oficina-detail.jpg'
];

// Verificar e criar versões otimizadas
imagesToOptimize.forEach(imagePath => {
  if (fs.existsSync(imagePath)) {
    const optimizedPath = imagePath.replace('.', '.min.');
    console.log(✅ ${imagePath} → ${optimizedPath});
  } else {
    console.log(⚠  Imagem não encontrada: ${imagePath});
  }
});

console.log('🎯 Dica: Use ferramentas online para comprimir imagens:');
console.log('   - TinyPNG: https://tinypng.com/');
console.log('   - Squoosh: https://squoosh.app/');
console.log('   - ImageOptim: https://imageoptim.com/');
