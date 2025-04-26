// ====== CONFIGURAÇÕES DE TEMA CLARO/ESCURO ======
const toggleBtn = document.getElementById("toggleTheme");
const htmlTag = document.getElementById("htmlRoot");

function aplicarTemaSalvo() {
  const tema = localStorage.getItem("tema") || "dark";
  htmlTag.classList.remove("light", "dark");
  htmlTag.classList.add(tema);
}

toggleBtn.addEventListener("click", () => {
  const temaAtual = htmlTag.classList.contains("light") ? "light" : "dark";
  const novoTema = temaAtual === "dark" ? "light" : "dark";
  htmlTag.classList.remove("light", "dark");
  htmlTag.classList.add(novoTema);
  localStorage.setItem("tema", novoTema);
});

aplicarTemaSalvo();

// ====== VANILLA TILT NOS CARDS ======
VanillaTilt.init(document.querySelectorAll(".tilt"), {
  max: 10,
  speed: 400,
  glare: true,
  "max-glare": 0.2
});

// ====== COPIAR PLANO ======
document.getElementById("copiarPlano").addEventListener("click", () => {
  const plano = document.getElementById("planoAlimentar").innerText;
  navigator.clipboard.writeText(plano).then(() => {
    alert("Plano copiado com sucesso!");
  });
});

// ====== GERAR PDF ======
document.getElementById("baixarPDF").addEventListener("click", () => {
  const resultado = document.getElementById("resultado");
  html2pdf().set({
    margin: 0.5,
    filename: 'plano-macrofit.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(resultado).save();
});

// ====== COMPARTILHAR ======
document.getElementById("compartilhar").addEventListener("click", () => {
  const plano = document.getElementById("planoAlimentar").innerText;
  if (navigator.share) {
    navigator.share({
      title: 'Meu Plano Alimentar - MacroFit',
      text: plano,
      url: window.location.href
    });
  } else {
    alert("Compartilhamento não suportado neste navegador.");
  }
});
// ====== ASSISTENTE PESSOAL - CHATBOT INTELIGENTE ======

document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.getElementById('toggleChat');
  const chatContainer = document.getElementById('chatbotContainer');
  const chatIcon = document.getElementById('chatIcon');
  const sendButton = document.getElementById('sendMessage');
  const userInput = document.getElementById('userInput');
  const chatMessages = document.getElementById('chatMessages');
  const quickQuestions = document.querySelector('.quick-questions');

  let conversaEstado = localStorage.getItem('conversaEstado') || 'inicio';
  let userData = JSON.parse(localStorage.getItem('userData')) || {};

  chatToggle.addEventListener('click', () => {
    chatContainer.classList.toggle('hidden');
    chatIcon.textContent = chatContainer.classList.contains('hidden') ? '💬' : '✖️';
  });

  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  iniciarConversa();

  function iniciarConversa() {
    if (userData.nome) {
      addMessage('bot', `Olá novamente, ${userData.nome}. Em que posso lhe ajudar hoje?`);
      conversaEstado = 'pronto';
    } else {
      addMessage('bot', `Olá! Seja bem-vindo ao MacroFit. Qual é o seu nome?`);
      conversaEstado = 'perguntarNome';
    }
    localStorage.setItem('conversaEstado', conversaEstado);
  }

  function sendMessage() {
    const message = userInput.value.trim();
    if (message !== '') {
      addMessage('user', message);
      userInput.value = '';
      setTimeout(() => {
        addTyping();
        setTimeout(() => {
          removeTyping();
          processarResposta(message);
        }, 800);
      }, 200);
    }
  }

  function addMessage(type, text) {
    const div = document.createElement('div');
    div.classList.add('message', type);
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTyping() {
    const div = document.createElement('div');
    div.id = 'typing';
    div.classList.add('message', 'bot');
    div.textContent = 'Digitando...';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const typingDiv = document.getElementById('typing');
    if (typingDiv) typingDiv.remove();
  }
  function processarResposta(msg) {
    const texto = msg.toLowerCase();

    if (conversaEstado === 'perguntarNome') {
      userData.nome = msg.split(' ')[0];
      localStorage.setItem('userData', JSON.stringify(userData));
      addMessage('bot', `Prazer, ${userData.nome}. Qual seu objetivo atual? (emagrecer, ganhar massa, saúde)`);
      conversaEstado = 'perguntarObjetivo';
      localStorage.setItem('conversaEstado', conversaEstado);
      return;
    }

    if (conversaEstado === 'perguntarObjetivo') {
      if (texto.includes('emagrecer') || texto.includes('massa') || texto.includes('saúde')) {
        userData.objetivo = texto.includes('massa') ? 'ganhar massa' : texto;
        localStorage.setItem('userData', JSON.stringify(userData));
        addMessage('bot', `Entendi. Possui alguma restrição ou preferência alimentar? (normal, vegetariano, low-carb)`);
        conversaEstado = 'perguntarDieta';
        localStorage.setItem('conversaEstado', conversaEstado);
      } else {
        addMessage('bot', `Por favor, informe se seu objetivo é emagrecer, ganhar massa ou manter a saúde.`);
      }
      return;
    }

    if (conversaEstado === 'perguntarDieta') {
      if (texto.includes('normal') || texto.includes('vegetariano') || texto.includes('low')) {
        userData.dieta = texto.includes('vegetariano') ? 'vegetariano' : (texto.includes('low') ? 'low-carb' : 'normal');
        localStorage.setItem('userData', JSON.stringify(userData));
        addMessage('bot', `Ótimo. Qual o seu peso atual em kg?`);
        conversaEstado = 'perguntarPeso';
        localStorage.setItem('conversaEstado', conversaEstado);
      } else {
        addMessage('bot', `Desculpe, não entendi. Informe: normal, vegetariano ou low-carb.`);
      }
      return;
    }

    if (conversaEstado === 'perguntarPeso') {
      const peso = parseFloat(texto.replace(',', '.'));
      if (!isNaN(peso)) {
        userData.peso = peso;
        localStorage.setItem('userData', JSON.stringify(userData));
        addMessage('bot', `Obrigado. Agora, informe sua altura em cm.`);
        conversaEstado = 'perguntarAltura';
        localStorage.setItem('conversaEstado', conversaEstado);
      } else {
        addMessage('bot', `Desculpe, não entendi o peso. Informe apenas o número.`);
      }
      return;
    }

    if (conversaEstado === 'perguntarAltura') {
      const altura = parseFloat(texto.replace(',', '.'));
      if (!isNaN(altura)) {
        userData.altura = altura;
        localStorage.setItem('userData', JSON.stringify(userData));
        addMessage('bot', `Perfeito. Por fim, qual a sua idade?`);
        conversaEstado = 'perguntarIdade';
        localStorage.setItem('conversaEstado', conversaEstado);
      } else {
        addMessage('bot', `Desculpe, não entendi a altura. Informe apenas o número.`);
      }
      return;
    }

    if (conversaEstado === 'perguntarIdade') {
      const idade = parseInt(texto);
      if (!isNaN(idade)) {
        userData.idade = idade;
        localStorage.setItem('userData', JSON.stringify(userData));
        calcularTDEE();
        conversaEstado = 'pronto';
        localStorage.setItem('conversaEstado', conversaEstado);
      } else {
        addMessage('bot', `Desculpe, não entendi a idade. Informe apenas o número.`);
      }
      return;
    }

    if (conversaEstado === 'pronto') {
      responderChatNormal(texto);
    }
  }
  function calcularTDEE() {
    const { idade, peso, altura, objetivo } = userData;
    if (!idade || !peso || !altura) {
      addMessage('bot', `Faltam dados para calcular seu gasto energético.`);
      return;
    }
    let tmb = 10 * peso + 6.25 * altura - 5 * idade + 5; // Fórmula de Harris-Benedict (homens)
    let tdee = tmb * 1.55; // Moderado como padrão

    if (objetivo.includes('emagrecer')) tdee -= 500;
    if (objetivo.includes('massa')) tdee += 500;

    userData.tdee = Math.round(tdee);
    userData.imc = (peso / ((altura / 100) ** 2)).toFixed(1);
    localStorage.setItem('userData', JSON.stringify(userData));

    addMessage('bot', `Com base nas suas informações, seu gasto calórico diário estimado é de ${userData.tdee} kcal.`);
    addMessage('bot', `Seu IMC atual é de ${userData.imc}.`);
    addMessage('bot', `Deseja que eu monte um cardápio semanal personalizado para você?`);

    quickQuestions.innerHTML = `
      <button class="quick-btn">Sim, quero o cardápio</button>
      <button class="quick-btn">Quero dicas de treino</button>
      <button class="quick-btn">Calcular meta de peso</button>
    `;

    document.querySelectorAll('.quick-btn').forEach(button => {
      button.addEventListener('click', () => {
        const question = button.textContent.toLowerCase();
        addMessage('user', button.textContent);
        setTimeout(() => {
          addTyping();
          setTimeout(() => {
            removeTyping();
            if (question.includes('cardápio')) {
              gerarCardapio();
            } else if (question.includes('treino')) {
              addMessage('bot', `Para melhores resultados, recomenda-se treinar entre 3 a 5 vezes por semana.`);
            } else if (question.includes('meta')) {
              sugerirMeta();
            }
          }, 800);
        }, 200);
      });
    });
  }

  function gerarCardapio() {
    const opcoesCafe = [
      "Ovos mexidos + Aveia",
      "Panqueca de banana + Café preto",
      "Iogurte natural + Granola sem açúcar",
      "Tapioca com frango desfiado"
    ];
    const opcoesAlmoco = [
      "Arroz integral + Frango grelhado + Brócolis",
      "Quinoa + Peixe assado + Salada verde",
      "Batata-doce + Carne magra + Abobrinha refogada",
      "Arroz branco + Omelete + Couve-flor cozida"
    ];
    const opcoesJantar = [
      "Omelete de legumes",
      "Sopa de legumes com frango",
      "Wrap integral de atum",
      "Salada com grão de bico"
    ];
    const opcoesLanches = [
      "Iogurte natural",
      "Frutas secas",
      "Mix de castanhas",
      "Barra de proteína"
    ];

    addMessage('bot', `Aqui está seu cardápio semanal variado:`);

    for (let dia = 1; dia <= 7; dia++) {
      const cafe = opcoesCafe[Math.floor(Math.random() * opcoesCafe.length)];
      const almoco = opcoesAlmoco[Math.floor(Math.random() * opcoesAlmoco.length)];
      const jantar = opcoesJantar[Math.floor(Math.random() * opcoesJantar.length)];
      const lanche = opcoesLanches[Math.floor(Math.random() * opcoesLanches.length)];

      addMessage('bot', `Dia ${dia}: Café: ${cafe} | Almoço: ${almoco} | Jantar: ${jantar} | Lanche: ${lanche}`);
    }
    addMessage('bot', `Lembre-se: ajuste as quantidades conforme sua fome e seu objetivo!`);
  }

  function sugerirMeta() {
    addMessage('bot', `Qual seria seu objetivo de peso? Informe o peso em kg que deseja atingir.`);
    conversaEstado = 'esperandoMetaPeso';
    localStorage.setItem('conversaEstado', conversaEstado);
  }

  function responderChatNormal(msg) {
    if (conversaEstado === 'esperandoMetaPeso') {
      const pesoMeta = parseFloat(msg.replace(',', '.'));
      if (!isNaN(pesoMeta)) {
        const diferenca = (userData.peso - pesoMeta).toFixed(1);
        if (diferenca > 0) {
          addMessage('bot', `Para perder ${diferenca} kg, será necessário manter um déficit de cerca de 500 kcal diários, resultando em uma perda estimada de 0,5 kg por semana.`);
        } else {
          addMessage('bot', `Para ganhar ${(diferenca * -1).toFixed(1)} kg, é necessário um superávit de cerca de 300-500 kcal por dia.`);
        }
        conversaEstado = 'pronto';
        localStorage.setItem('conversaEstado', conversaEstado);
      } else {
        addMessage('bot', `Desculpe, não entendi. Informe apenas o número do peso desejado.`);
      }
      return;
    }

    if (msg.includes('proteína') || msg.includes('proteinas')) {
      addMessage('bot', "Proteínas são nutrientes essenciais para a construção muscular e recuperação do corpo.");
    } else if (msg.includes('carboidrato') || msg.includes('carboidratos')) {
      addMessage('bot', "Carboidratos são a principal fonte de energia para o corpo.");
    } else if (msg.includes('gordura') || msg.includes('gorduras')) {
      addMessage('bot', "Gorduras saudáveis são importantes para a produção de hormônios e absorção de vitaminas.");
    } else if (msg.includes('metabolismo') || msg.includes('tmb')) {
      addMessage('bot', "Seu metabolismo é o conjunto de processos que transformam o que você come em energia.");
    } else {
      addMessage('bot', `Estou à disposição para ajudá-lo em seu objetivo. Pergunte sobre alimentação, treino, suplementação ou planejamento.`);
    }
  }
});
// ====== FECHAMENTO FINAL DO SCRIPT ======

// Eventualmente, podemos adicionar mensagens motivacionais automáticas:
function mensagensMotivacionais() {
  const mensagens = [
    "Cada passo hoje é um resultado amanhã. Continue firme!",
    "Lembre-se: consistência supera perfeição.",
    "Seu futuro começa agora. Vamos construir juntos!",
    "Orgulhe-se de cada pequeno progresso!"
  ];
  const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
  addMessage('bot', mensagem);
}

// Chamamos uma mensagem motivacional aleatória a cada 5 interações, por exemplo
let contadorInteracoes = 0;

function addMessage(type, text) {
  const div = document.createElement('div');
  div.classList.add('message', type);
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (type === 'user') {
    contadorInteracoes++;
    if (contadorInteracoes % 5 === 0) {
      setTimeout(() => {
        addTyping();
        setTimeout(() => {
          removeTyping();
          mensagensMotivacionais();
        }, 800);
      }, 200);
    }
  }
}

// ====== FINAL ======
