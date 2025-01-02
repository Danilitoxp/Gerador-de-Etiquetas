const carousel = document.querySelector('.carousel');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

let currentIndex = 0;

// Função para verificar e aplicar a classe 'clicavel' à imagem no centro
function updateClickableImage() {
  const links = carousel.querySelectorAll('a');

  links.forEach((link, index) => {
    if (index === currentIndex) {
      link.classList.add('clicavel');
    } else {
      link.classList.remove('clicavel');
    }
  });
}

// Atualize a imagem clicável no início
updateClickableImage();

nextBtn.addEventListener('click', () => {
  if (currentIndex < carousel.children.length - 1) {
    currentIndex++;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateClickableImage();  // Atualiza a imagem clicável
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateClickableImage();  // Atualiza a imagem clicável
  }
});



// Exemplo básico usando pdf-lib.js para gerar e baixar um PDF
async function downloadPDF() {
    const { PDFDocument, rgb } = PDFLib;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const imgData = canvas.toDataURL('image/jpeg');
    const img = await pdfDoc.embedJpg(imgData);

    const { width, height } = img.scale(0.5);
    page.drawImage(img, {
        x: 50,
        y: page.getHeight() - height - 50,
        width: width,
        height: height,
    });

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, 'etiqueta.pdf', 'application/pdf');
}

// Função para baixar PDF quando o botão é clicado
document.getElementById('download-btn').addEventListener('click', downloadPDF);

// Função para atualizar a arte com novos dados
function updateArtwork() {
    // Atualizar descrição
    description = document.getElementById('description').value;

    // Atualizar imagem do produto, se selecionada
    const input = document.getElementById('product-image');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            productImage = new Image();
            productImage.onload = function() {
                redrawCanvas();
            };
            productImage.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        redrawCanvas();
    }
}

// Função para redesenhar o Canvas com os novos dados
function redrawCanvas() {
    // Limpar o Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redesenhar o design inicial (exemplo)
    loadInitialDesign();

    // Desenhar imagem do produto, se disponível
    if (productImage) {
        const imgWidth = 200; // Largura desejada da imagem
        const imgHeight = 200; // Altura desejada da imagem
        ctx.drawImage(productImage, 20, 20, imgWidth, imgHeight);
    }
}
