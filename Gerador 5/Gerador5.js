document.addEventListener('DOMContentLoaded', () => {
    const previewEtiqueta = document.getElementById('previewEtiqueta');
    const numeroPrateleira = document.getElementById('numeroPrateleira');
    const descricaoEtiqueta = document.getElementById('descricaoEtiqueta');
    const adicionarEtiquetaBtn = document.querySelector('.enviar');
    const baixarPDFBtn = document.getElementById('baixarPDF');
    let etiquetas = [];

    const atualizarDescricaoEtiqueta = () => {
        const descricaoTexto = numeroPrateleira.value.trim();
        descricaoEtiqueta.textContent = descricaoTexto || '';
        descricaoEtiqueta.style.display = descricaoTexto ? 'block' : 'none';

        descricaoEtiqueta.style.height = "100px"; // Ajuste conforme o tamanho do texto que você deseja
    };

    const renderizarEtiquetas = () => {
        for (let i = 0; i < 10; i++) {
            const etiquetaBox = document.getElementById(`etiqueta${i + 1}`);
            etiquetaBox.innerHTML = '';

            if (etiquetas[i]) {
                etiquetaBox.innerHTML = `
                    <div class="etiqueta-content etiqueta-deitada" id='etiqueta-content-${i}'>
                        <img src="${etiquetas[i]}" alt="Etiqueta" style="width: 100%; height: auto;" />
                        <button class="delete-btn"><i class='bx bx-x'></i></button>
                    </div>`;
                
                etiquetaBox.querySelector('.delete-btn').addEventListener('click', () => {
                    const etiquetaContent = document.getElementById(`etiqueta-content-${i}`);
                    etiquetaContent.classList.add('fade-out'); // Adiciona a animação de fade out

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

        if (etiquetas.length >= 2) { // Limite de 2 etiquetas
            alert('Você atingiu o limite de 2 etiquetas.');
            return;
        }

        // Atualiza a descrição com base no input
        const descricaoTexto = numeroPrateleira.value.trim();
        descricaoEtiqueta.textContent = descricaoTexto || `Etiqueta N° ${etiquetas.length + 1}`;
        
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
        const etiquetaWidth = 146; // Largura da etiqueta
        const etiquetaHeight = 140; // Altura da etiqueta (ajustado para caber duas)
    
        // Dimensões da página A4 em mm
        const pdfWidth = 210; // Largura da página A4
        const pdfHeight = 297; // Altura da página A4
    
        // Margens e espaçamento
        const etiquetaSpacing = 0; // Espaçamento entre etiquetas
        const xOffset = (pdfWidth - etiquetaWidth) / 2; // Centralizar horizontalmente
    
        let x = xOffset; // Posição x
        let y = 10; // Posição y inicial (margem superior)
    
        etiquetas.forEach((imgData, index) => {
            // Verifica se a próxima etiqueta ultrapassa os limites da página
            if (y + etiquetaHeight > pdfHeight) {
                pdf.addPage(); // Adiciona nova página
                y = 10; // Reiniciar y para o topo da nova página
            }
    
            // Adiciona a imagem da etiqueta
            pdf.addImage(imgData, 'PNG', x, y, etiquetaWidth, etiquetaHeight);
    
            // Atualizar y para a próxima etiqueta (uma abaixo da outra)
            y += etiquetaHeight + etiquetaSpacing; // Mover para a próxima posição vertical
        });
    
        pdf.save('etiquetas.pdf');
    };
    
    numeroPrateleira.addEventListener('input', atualizarDescricaoEtiqueta);
    adicionarEtiquetaBtn.addEventListener('click', adicionarEtiqueta);
    baixarPDFBtn.addEventListener('click', baixarPDF);
});
