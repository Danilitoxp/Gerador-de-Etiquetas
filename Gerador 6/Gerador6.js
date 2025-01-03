document.addEventListener('DOMContentLoaded', () => {
    const textCountSelect = document.getElementById('textCount');
    const textInputsContainer = document.getElementById('textInputsContainer');
    const folderNameInput = document.getElementById('folderName');
    const previewEtiquetaContainer = document.getElementById('previewEtiquetaContainer');
    const folhaContainer = document.querySelector('.folha');
    const baixarPDFButton = document.getElementById('baixarPDF');
    const adicionarEtiquetaButton = document.querySelector('.enviar');

    const etiquetas = [];

    // Função para criar inputs dinamicamente
    const updateTextInputs = () => {
        const count = parseInt(textCountSelect.value, 10);
        textInputsContainer.innerHTML = ''; // Limpa os inputs existentes

        for (let i = 1; i <= count; i++) {
            const input = document.createElement('input');
            input.id = `descricao${i}`;
            input.type = 'text';
            input.placeholder = `Texto ${i}`;
            textInputsContainer.appendChild(input);
        }
    };

    // Atualiza os inputs quando o select muda
    textCountSelect.addEventListener('change', updateTextInputs);

    // Inicializa os inputs com o valor padrão do select
    updateTextInputs();

    // Carrega o SVG dinamicamente
    fetch('/assets/images/OPÇÕES 6/LUCAS.svg')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o SVG: ' + response.statusText);
            }
            return response.text();
        })
        .then(svgContent => {
            previewEtiquetaContainer.innerHTML = svgContent;

            const updatePreviewTexts = () => {
                const count = parseInt(textCountSelect.value, 10);

                // Define posições específicas para cada cenário
                const positionsByCount = {
                    1: [
                        { x: '50%', y: '50%' } // Um texto centralizado
                    ],
                    2: [
                        { x: '50%', y: '33%' }, // Texto 1
                        { x: '50%', y: '63%' }  // Texto 2
                    ],
                    3: [
                        { x: '50%', y: '25%' }, // Texto 1
                        { x: '50%', y: '52%' }, // Texto 2
                        { x: '50%', y: '80%' }  // Texto 3
                    ]
                };

                const positions = positionsByCount[count] || [];

                for (let i = 1; i <= 3; i++) {
                    const textElement = previewEtiquetaContainer.querySelector(`#texto${i} tspan`);
                    const inputElement = document.getElementById(`descricao${i}`);
                    if (textElement) {
                        if (i <= count) {
                            textElement.textContent = inputElement ? inputElement.value || `TEXTO ${i}` : '';
                            const parent = textElement.parentElement;
                            parent.setAttribute('x', positions[i - 1].x); // Posição horizontal
                            parent.setAttribute('y', positions[i - 1].y); // Posição vertical
                            parent.setAttribute('text-anchor', 'middle');
                            parent.setAttribute('dominant-baseline', 'middle');
                        } else {
                            textElement.textContent = '';
                        }
                    }
                }
            };

            textInputsContainer.addEventListener('input', updatePreviewTexts);
            textCountSelect.addEventListener('change', updatePreviewTexts);

            adicionarEtiquetaButton.addEventListener('click', () => {
                const clone = previewEtiquetaContainer.cloneNode(true);
                clone.style.marginBottom = "0";
                etiquetas.push(clone);
                folhaContainer.appendChild(clone);
            });
        })
        .catch(error => console.error('Erro ao carregar SVG:', error));

    baixarPDFButton.addEventListener('click', () => {
        const folderName = folderNameInput.value || 'minha_pasta';
        const zip = new JSZip();

        html2canvas(folhaContainer, { scale: 2 }).then(canvas => {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const halfWidth = Math.floor(canvasWidth / 2);

            const canvas1 = document.createElement('canvas');
            canvas1.width = halfWidth;
            canvas1.height = canvasHeight;
            const ctx1 = canvas1.getContext('2d');
            ctx1.drawImage(canvas, 0, 0, halfWidth, canvasHeight, 0, 0, halfWidth, canvasHeight);
            const img1 = canvas1.toDataURL('image/png');
            zip.file(`etiqueta_parte_esquerda.png`, img1.split(',')[1], { base64: true });

            const canvas2 = document.createElement('canvas');
            canvas2.width = halfWidth;
            canvas2.height = canvasHeight;
            const ctx2 = canvas2.getContext('2d');
            ctx2.drawImage(canvas, halfWidth, 0, halfWidth, canvasHeight, 0, 0, halfWidth, canvasHeight);
            const img2 = canvas2.toDataURL('image/png');
            zip.file(`etiqueta_parte_direita.png`, img2.split(',')[1], { base64: true });

            zip.generateAsync({ type: 'blob' }).then(content => {
                saveAs(content, `${folderName}.zip`);
            });
        });
    });
});
