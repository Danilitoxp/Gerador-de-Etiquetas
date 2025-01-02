document.addEventListener('DOMContentLoaded', () => {
    const fornecedoresSelect = document.getElementById('fornecedores');
    const previewEtiqueta = document.getElementById('previewEtiqueta');
    const imagemUpload = document.getElementById('imagemUpload');
    const uploadedImage = document.getElementById('uploadedImage');
    const descricaoInput = document.getElementById('descricao');
    const descricaoEtiqueta = document.getElementById('descricaoEtiqueta');
    const adicionarEtiquetaBtn = document.querySelector('.enviar');
    const baixarPDFBtn = document.getElementById('baixarPDF');
    let etiquetas = [];

    const atualizarLogoFornecedor = () => {
        const selectedFornecedor = fornecedoresSelect.value;
        previewEtiqueta.src = `/assets/images/OPÇÕES 1/${selectedFornecedor}.png`;
    };

    const exibirImagemUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };

    const atualizarDescricaoEtiqueta = () => {
        const descricaoTexto = descricaoInput.value.trim();
        descricaoEtiqueta.textContent = descricaoTexto || '';
        descricaoEtiqueta.style.display = descricaoTexto ? 'block' : 'none';
    };

    const renderizarEtiquetas = () => {
        for (let i = 0; i < 10; i++) {
            const etiquetaBox = document.getElementById(`etiqueta${i + 1}`);
            etiquetaBox.innerHTML = '';
    
            if (etiquetas[i]) {
                etiquetaBox.innerHTML = `
                    <div class="etiqueta-content" id='etiqueta-content-${i}'>
                        <img src="${etiquetas[i]}" alt="Etiqueta" style="width: 100%; height: auto;" />
                        <button class="delete-btn"><i class='bx bx-x'></i></button>
                    </div>`;
                
                // Adiciona o event listener para exclusão da etiqueta
                etiquetaBox.querySelector('.delete-btn').addEventListener('click', () => {
                    const etiquetaContent = document.getElementById(`etiqueta-content-${i}`);
                    etiquetaContent.classList.add('fade-out'); // Adiciona a animação de fade out
    
                    // Espera a animação terminar antes de remover a etiqueta
                    setTimeout(() => {
                        etiquetas.splice(i, 1); // Remove a etiqueta da lista
                        renderizarEtiquetas(); // Re-renderiza as etiquetas
                    }, 500); // Tempo deve ser igual ao tempo da animação de fade out
                });
            }
        }
    };
    

    const adicionarEtiqueta = (event) => {
        event.preventDefault();
        
        if (etiquetas.length >= 10) {
            alert('Você atingiu o limite de 10 etiquetas.');
            return;
        }
    
        // Atualiza a descrição com base no input
        const descricaoTexto = descricaoInput.value.trim();
        if (!descricaoTexto) {
            descricaoEtiqueta.textContent = `Etiqueta N° ${etiquetas.length + 1}`;
        } else {
            descricaoEtiqueta.textContent = descricaoTexto;
        }
    
        // Gerar a imagem da etiqueta
        html2canvas(document.getElementById('previewEtiquetaContainer'), { scale: 2 }).then(canvas => {
            const imagem = canvas.toDataURL('image/png');
            etiquetas.push(imagem); // Adiciona a imagem da etiqueta à lista
            renderizarEtiquetas(); // Re-renderiza as etiquetas
        });
    };
    

    const baixarPDF = () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
    
        // Dimensões da etiqueta em mm
        const etiquetaWidth = 97.03; // Largura da etiqueta
        const etiquetaHeight = 53.99; // Altura da etiqueta
    
        // Dimensões da página A4 em mm
        const pdfWidth = 210; // Largura da página A4
        const pdfHeight = 297; // Altura da página A4
    
        // Margens e espaçamento
        const etiquetaSpacing = 5; // Espaçamento entre etiquetas
    
        // Número de etiquetas por linha e coluna
        const etiquetasPorLinha = 2;
        const etiquetasPorColuna = 5;
    
        // Calcular o offset horizontal e vertical
        const xOffset = (pdfWidth - (etiquetasPorLinha * etiquetaWidth + (etiquetasPorLinha - 1) * etiquetaSpacing)) / 2;
        const yOffset = (pdfHeight - (etiquetasPorColuna * etiquetaHeight + (etiquetasPorColuna - 1) * etiquetaSpacing)) / 2;
    
        let x = xOffset;
        let y = yOffset;
    
        etiquetas.forEach((imgData, index) => {
            pdf.addImage(imgData, 'PNG', x, y, etiquetaWidth, etiquetaHeight);
    
            // Atualizar posição para a próxima etiqueta
            if ((index + 1) % etiquetasPorLinha === 0) {
                x = xOffset;
                y += etiquetaHeight + etiquetaSpacing;
            } else {
                x += etiquetaWidth + etiquetaSpacing;
            }
    
            // Adicionar nova página se necessário
            if ((index + 1) % (etiquetasPorLinha * etiquetasPorColuna) === 0 && index < etiquetas.length - 1) {
                pdf.addPage();
                x = xOffset;
                y = yOffset;
            }
        });
    
        pdf.save('etiquetas.pdf');
        window.location.reload();
    };

    fornecedoresSelect.addEventListener('change', atualizarLogoFornecedor);
    imagemUpload.addEventListener('change', exibirImagemUpload);
    descricaoInput.addEventListener('input', atualizarDescricaoEtiqueta);
    adicionarEtiquetaBtn.addEventListener('click', adicionarEtiqueta);
    baixarPDFBtn.addEventListener('click', baixarPDF);
});
