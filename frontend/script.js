const API_BASE_URL = 'http://localhost:3000';

let jogadorLogado = null;
let modoSelecionado = 'salte+';
let diaSelecionado = 'D';

// Elementos do DOM
const telaDeslogada = document.getElementById('tela-deslogada');
const telaLogada = document.getElementById('tela-logada');
const modalLogin = document.getElementById('modal-login');
const btnLoginModal = document.getElementById('btn-login-modal');
const btnConfirmarLogin = document.getElementById('btn-confirmar-login');

const inputNomeJogador = document.getElementById('input-nome-jogador');
const inputAlturaJogador = document.getElementById('input-altura-jogador');
const infoJogadorContainer = document.getElementById('info-jogador');
const detalhesTreino = document.getElementById('detalhes-treino');

// Abrir Modal de Login
if (btnLoginModal) {
    btnLoginModal.addEventListener('click', () => {
        modalLogin.classList.remove('escondido');
    });
}

// Fazer Login na API (Validando Nome e Altura)
if (btnConfirmarLogin) {
    btnConfirmarLogin.addEventListener('click', async () => {
        const nome = inputNomeJogador.value.trim();
        const altura = Number(inputAlturaJogador.value);

        if (!nome || !altura) {
            return alert('Por favor, preencha o nome e a altura!');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/jogadores/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, altura })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao efetuar login!');
            }

            jogadorLogado = data;
            
            // Exibe os dados do perfil e alterna para a tela logada
            renderizarPerfil();
            modalLogin.classList.add('escondido');
            telaDeslogada.classList.add('escondido');
            telaLogada.classList.remove('escondido');

            // Carrega a sequência de treinos
            carregarTreino();
        } catch (error) {
            alert(error.message);
        }
    });
}

// Renderizar dados do Jogador no painel lateral
function renderizarPerfil() {
    if (!jogadorLogado) return;

    infoJogadorContainer.innerHTML = `
        <p><strong>Nome:</strong> ${jogadorLogado.nome}</p>
        <p><strong>Posição:</strong> ${jogadorLogado.posicao || 'N/A'}</p>
        <p><strong>Idade:</strong> ${jogadorLogado.idade || 'N/A'} anos</p>
        <p><strong>Altura:</strong> ${jogadorLogado.altura} cm</p>
        <p><strong>Envergadura:</strong> ${jogadorLogado.envergadura || 'N/A'} cm</p>
        <p><strong>Alcance Vert.:</strong> ${jogadorLogado.al_ver || 'N/A'} cm</p>
    `;
}

// Seleção dos modos de treino (salte+, defenda+, ataque+)
document.querySelectorAll('.btn-modo').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-modo').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        modoSelecionado = e.target.getAttribute('data-tipo');
        carregarTreino();
    });
});

// Seleção dos dias da semana
document.querySelectorAll('.btn-dia').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-dia').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        diaSelecionado = e.target.getAttribute('data-dia');
        carregarTreino();
    });
});

// Buscar e exibir o treino correspondente vindo da base de dados
async function carregarTreino() {
    try {
        const response = await fetch(`${API_BASE_URL}/sequencias-treino`);
        const treinos = await response.json();

        // Procura pelo treino correspondente ao modo selecionado
        const treinoEncontrado = treinos.find(t => t.tipo.toLowerCase() === modoSelecionado.toLowerCase());

        if (treinoEncontrado) {
            detalhesTreino.innerHTML = `
                <h4>Treino para ${modoSelecionado.toUpperCase()}</h4>
                <p style="margin-top: 15px; font-size: 1.1rem; line-height: 1.6;">
                    ${treinoEncontrado.treino}
                </p>
            `;
        } else {
            detalhesTreino.innerHTML = `
                <p>Nenhum treino cadastrado para o modo <strong>${modoSelecionado}</strong>.</p>
            `;
        }
    } catch (error) {
        detalhesTreino.innerHTML = `<p>Erro ao carregar os treinos da API.</p>`;
    }
}