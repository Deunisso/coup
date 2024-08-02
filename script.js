let jogoIniciado = false;
let cartasSorteadas = [];
let historicoTrocas = [];
let cartasParaTroca = [];

// Função para iniciar o jogo e sortear as cartas
function iniciarJogo() {
    const cartasEmbaralhadas = baralho.sort(() => Math.random() - 0.5);
    cartasSorteadas = cartasEmbaralhadas.slice(0, 2);
    jogoIniciado = true;

    document.getElementById('iniciar').style.display = 'none'; // Oculta o botão de iniciar

    document.getElementById('resultado').innerText = `Cartas sorteadas: ${cartasSorteadas.join(' e ')}`;
    exibirCartas(cartasSorteadas);
    document.getElementById('historico').innerText = '';
    document.getElementById('fim-jogo').innerText = ''; // Limpa a mensagem de fim de jogo
}

// Função para finalizar o jogo
function finalizarJogo() {
    document.getElementById('resultado').innerText = '';
    document.getElementById('cartas').innerHTML = '';
    document.getElementById('historico').innerText = '';
    document.getElementById('fim-jogo').innerText = 'Fim de jogo! Todas as cartas foram eliminadas.';
    document.getElementById('iniciar').style.display = 'inline'; // Mostra o botão de iniciar
    jogoIniciado = false; // Reseta o estado do jogo
}

// Função para abrir o modal de troca de cartas
function abrirModalTroca() {
    const cartasEmbaralhadas = baralho.sort(() => Math.random() - 0.5);
    const cartasParaEscolha = cartasEmbaralhadas.slice(0, 4); // Pega 4 cartas para escolha

    const modalCartas = document.getElementById('modal-cartas');
    modalCartas.innerHTML = '';

    cartasParaEscolha.forEach((carta, index) => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.dataset.index = index; // Adiciona o índice como atributo de dados
        
        const img = new Image();
        img.src = `imagens/${carta}.jpg`;
        img.onload = () => {
            div.innerHTML = `
                <img src="${img.src}" alt="${carta}">
                <div class="nome">${carta}</div>
            `;
        };
        img.onerror = () => {
            console.error(`Imagem não encontrada: imagens/${carta}.jpg`);
            div.innerHTML = `
                <img src="imagens/Erro.jpg" alt="Imagem não encontrada">
                <div class="nome">Imagem não encontrada</div>
            `;
        };

        div.addEventListener('click', () => selecionarCartaTroca(carta));
        modalCartas.appendChild(div);
    });

    cartasParaTroca = [];
    document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal de troca de cartas
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Função para selecionar uma carta para troca
function selecionarCartaTroca(carta) {
    if (cartasParaTroca.length < 2) {
        cartasParaTroca.push(carta);
    } else {
        // Se já houver duas cartas selecionadas, substitui a primeira
        cartasParaTroca[0] = carta;
    }

    // Atualiza a visualização das cartas selecionadas
    document.getElementById('modal-cartas').querySelectorAll('.carta').forEach(div => {
        div.style.border = cartasParaTroca.includes(div.querySelector('.nome').textContent) ? '2px solid green' : '';
    });
}

// Função para confirmar a troca de cartas
function confirmarTroca() {
    if (cartasParaTroca.length !== 2) {
        alert('Selecione exatamente duas cartas para a troca.');
        return;
    }

    const cartasEmbaralhadas = baralho.sort(() => Math.random() - 0.5);
    const baralhoAtualizado = cartasEmbaralhadas.filter(carta => !cartasSorteadas.includes(carta));
    
    if (baralhoAtualizado.length < 2) {
        document.getElementById('resultado').innerText = 'Não há cartas suficientes para trocar.';
        return;
    }

    const novasCartas = cartasParaTroca;
    const trocaLog = `Troca: ${cartasSorteadas.join(' e ')} -> ${novasCartas.join(' e ')}`;
    historicoTrocas.push(trocaLog);

    document.getElementById('resultado').innerText = `Cartas após troca: ${novasCartas.join(' e ')}`;
    exibirCartas(novasCartas);
    document.getElementById('historico').innerText = `Histórico de trocas:\n${historicoTrocas.join('\n')}`;
    cartasSorteadas = novasCartas;

    closeModal();

    // Verificar se todas as cartas foram eliminadas
    if (cartasSorteadas.length === 0) {
        finalizarJogo(); // Exibe a mensagem de fim de jogo
    }
}

// Função para exibir as cartas na tela
function exibirCartas(cartas) {
    const container = document.getElementById('cartas');
    container.innerHTML = '';
    const extensao = 'jpg'; // Apenas arquivos .jpg

    cartas.forEach((carta, index) => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.id = `carta-${index}`;
        div.dataset.index = index; // Adiciona o índice como atributo de dados
        
        const img = new Image();
        img.src = `imagens/${carta}.${extensao}`;
        img.onload = () => {
            div.innerHTML = `
                <img src="${img.src}" alt="${carta}">
                <div class="nome">${carta}</div>
                <div class="remove-btn" onclick="eliminarCarta(${index})"></div>
                ${carta === 'Embaixador' ? '<div class="troca-area" onclick="abrirModalTroca()"></div>' : ''}
            `;
        };
        img.onerror = () => {
            console.error(`Imagem não encontrada: imagens/${carta}.${extensao}`);
            div.innerHTML = `
                <img src="imagens/Erro.jpg" alt="Imagem não encontrada">
                <div class="nome">Imagem não encontrada</div>
            `;
        };

        container.appendChild(div);
    });
}

// Função para eliminar uma carta
function eliminarCarta(index) {
    if (!jogoIniciado) {
        document.getElementById('resultado').innerText = 'Primeiro, inicie o jogo.';
        return;
    }

    if (cartasSorteadas.length === 0) {
        document.getElementById('resultado').innerText = 'Primeiro, sorteie duas cartas.';
        return;
    }

    if (index < 0 || index >= cartasSorteadas.length) {
        document.getElementById('resultado').innerText = 'Índice de carta inválido.';
        return;
    }

    cartasSorteadas.splice(index, 1);

    if (cartasSorteadas.length === 0) {
        document.getElementById('resultado').innerText = '';
        document.getElementById('cartas').innerHTML = '';
        document.getElementById('historico').innerText = '';
        document.getElementById('fim-jogo').innerText = 'Fim de jogo! Todas as cartas foram eliminadas.';
        document.getElementById('iniciar').style.display = 'inline'; // Mostra o botão de iniciar
    } else {
        document.getElementById('resultado').innerText = `Cartas restantes: ${cartasSorteadas.join(' e ')}`;
        exibirCartas(cartasSorteadas);
    }
}

// Baralho de cartas
const baralho = [
    'Duque', 'Duque', 'Duque',
    'Assassino', 'Assassino', 'Assassino',
    'Embaixador', 'Embaixador', 'Embaixador',
    'Capitão', 'Capitão', 'Capitão',
    'Condessa', 'Condessa', 'Condessa'
];
