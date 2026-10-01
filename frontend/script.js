const API_BASE_URL = 'http://localhost:3000';

let jogadorLogado = null;
let modoSelecionado = 'salte+';
let diaSelecionado = 'Domingo';

// Variável para guardar temporariamente a imagem selecionada do PC
let fotoSelecionadaBase64 = null;

// --- MOCK DE FOTOS DE PERFIL PADRÃO ---
const fotosMockadas = {
    'LeBron James': 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png',
    'Curry': 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3975.png',
    'padrao': 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
};

const mapaDias = {
    'D': 'Domingo',
    'S': 'Segunda',
    'T': 'Terca',
    'Q1': 'Quarta',
    'Q2': 'Quinta',
    'S2': 'Sexta',
    'S3': 'Sabado'
};

// --- ELEMENTOS DO DOM ---
const telaDeslogada = document.getElementById('tela-deslogada');
const telaLogada = document.getElementById('tela-logada');
const modalLogin = document.getElementById('modal-login');
const modalPerfil = document.getElementById('modal-perfil');

const btnLoginModal = document.getElementById('btn-login-modal');
const btnConfirmarLogin = document.getElementById('btn-confirmar-login');
const btnVoltarPerfil = document.getElementById('btn-voltar-perfil');
const fotoPerfilBtn = document.querySelector('.foto-perfil');
const fotoPerfilModalHeader = document.querySelector('.foto-perfil.grande');

const inputNomeJogador = document.getElementById('input-nome-jogador');
const inputAlturaJogador = document.getElementById('input-altura-jogador');
const inputFotoFile = document.getElementById('edit-foto-file');
const formEditarPerfil = document.getElementById('form-editar-perfil');

const infoJogadorContainer = document.getElementById('info-jogador');
const detalhesTreino = document.getElementById('detalhes-treino');


// --- 1. LEITURA DA IMAGEM DO COMPUTADOR (FileReader) ---
if (inputFotoFile) {
    inputFotoFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                fotoSelecionadaBase64 = e.target.result; // Converte para Base64
            };
            reader.readAsDataURL(file);
        }
    });
}


// --- 2. FLUXO DE LOGIN ---
if (btnLoginModal) {
    btnLoginModal.addEventListener('click', () => {
        modalLogin.classList.remove('escondido');
    });
}

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, altura })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao efetuar login!');
            }

            jogadorLogado = data;

            // Foto padrão ou mockada por nome
            jogadorLogado.foto_url = fotosMockadas[jogadorLogado.nome] || fotosMockadas['padrao'];

            renderizarPerfil();
            modalLogin.classList.add('escondido');
            telaDeslogada.classList.add('escondido');
            telaLogada.classList.remove('escondido');

            carregarTreino();
        } catch (error) {
            alert(error.message);
        }
    });
}


// --- 3. PAINEL DE PERFIL E EDIÇÃO ---

function renderizarPerfil() {
    if (!jogadorLogado) return;

    atualizarElementoFoto(fotoPerfilBtn, jogadorLogado.foto_url);
    if (fotoPerfilModalHeader) {
        atualizarElementoFoto(fotoPerfilModalHeader, jogadorLogado.foto_url);
    }

    infoJogadorContainer.innerHTML = `
        <p><strong>Nome:</strong> ${jogadorLogado.nome}</p>
        <p><strong>Posição:</strong> ${jogadorLogado.posicao || 'N/A'}</p>
        <p><strong>Idade:</strong> ${jogadorLogado.idade || 'N/A'} anos</p>
        <p><strong>Altura:</strong> ${jogadorLogado.altura} cm</p>
        <p><strong>Envergadura:</strong> ${jogadorLogado.envergadura || 'N/A'} cm</p>
        <p><strong>Alcance Vert.:</strong> ${jogadorLogado.al_ver || 'N/A'} cm</p>
    `;
}

function atualizarElementoFoto(elemento, urlFoto) {
    if (!elemento) return;
    if (urlFoto && urlFoto.trim() !== '') {
        elemento.style.backgroundImage = `url('${urlFoto}')`;
        elemento.classList.add('com-foto');
    } else {
        elemento.style.backgroundImage = 'none';
        elemento.classList.remove('com-foto');
    }
}

// Abrir Modal de Edição
if (fotoPerfilBtn) {
    fotoPerfilBtn.addEventListener('click', () => {
        if (!jogadorLogado) return;

        document.getElementById('edit-nome').value = jogadorLogado.nome || '';
        document.getElementById('edit-altura').value = jogadorLogado.altura || '';
        document.getElementById('edit-idade').value = jogadorLogado.idade || '';
        document.getElementById('edit-envergadura').value = jogadorLogado.envergadura || '';
        document.getElementById('edit-al-ver').value = jogadorLogado.al_ver || '';
        document.getElementById('edit-posicao').value = jogadorLogado.posicao || '';

        // Limpa a seleção anterior de ficheiro
        if (inputFotoFile) {
            inputFotoFile.value = '';
        }
        fotoSelecionadaBase64 = null;

        modalPerfil.classList.remove('escondido');
    });
}

// Fechar Modal
if (btnVoltarPerfil) {
    btnVoltarPerfil.addEventListener('click', () => {
        modalPerfil.classList.add('escondido');
    });
}

// Salvar Alterações
if (formEditarPerfil) {
    formEditarPerfil.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dadosAtualizados = {
            nome: document.getElementById('edit-nome').value.trim(),
            altura: Number(document.getElementById('edit-altura').value),
            idade: Number(document.getElementById('edit-idade').value) || null,
            envergadura: Number(document.getElementById('edit-envergadura').value) || null,
            al_ver: Number(document.getElementById('edit-al-ver').value) || null,
            posicao: document.getElementById('edit-posicao').value.trim() || null
        };

        try {
            const response = await fetch(`${API_BASE_URL}/jogadores/${jogadorLogado.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao atualizar perfil.');
            }

            jogadorLogado = data;

            // Se o utilizador escolheu uma foto do PC, aplica a imagem Base64
            if (fotoSelecionadaBase64) {
                jogadorLogado.foto_url = fotoSelecionadaBase64;
            } else if (!jogadorLogado.foto_url) {
                jogadorLogado.foto_url = fotosMockadas['padrao'];
            }

            renderizarPerfil();

            alert('Informações atualizadas com sucesso!');
            modalPerfil.classList.add('escondido');
        } catch (error) {
            alert(error.message);
        }
    });
}


// --- 4. SELEÇÃO DE MODOS E DIAS DE TREINO ---

document.querySelectorAll('.btn-modo').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-modo').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        modoSelecionado = e.target.getAttribute('data-tipo');
        carregarTreino();
    });
});

document.querySelectorAll('.btn-dia').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-dia').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const siglaDia = e.target.getAttribute('data-dia');
        diaSelecionado = mapaDias[siglaDia] || siglaDia;

        carregarTreino();
    });
});

async function carregarTreino() {
    try {
        const response = await fetch(`${API_BASE_URL}/sequencias-treino`);
        const treinos = await response.json();

        const treinoEncontrado = treinos.find(t =>
            t.tipo.toLowerCase() === modoSelecionado.toLowerCase() &&
            t.dia.toLowerCase() === diaSelecionado.toLowerCase()
        );

        if (treinoEncontrado) {
            detalhesTreino.innerHTML = `
                <h4>Treino para ${modoSelecionado.toUpperCase()} (${diaSelecionado})</h4>
                <p style="margin-top: 15px; font-size: 1.1rem; line-height: 1.6;">
                    ${treinoEncontrado.treino}
                </p>
            `;
        } else {
            detalhesTreino.innerHTML = `
                <p>Nenhum treino cadastrado para <strong>${modoSelecionado}</strong> em <strong>${diaSelecionado}</strong>.</p>
            `;
        }
    } catch (error) {
        detalhesTreino.innerHTML = `<p>Erro ao carregar os treinos da API.</p>`;
    }
}