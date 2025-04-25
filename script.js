// Toggle de tema claro/escuro
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

// Tilt 3D nos cards
VanillaTilt.init(document.querySelectorAll(".tilt"), {
  max: 10,
  speed: 400,
  glare: true,
  "max-glare": 0.2
});

// Copiar plano alimentar
document.getElementById("copiarPlano").addEventListener("click", () => {
  const plano = document.getElementById("planoAlimentar").innerText;
  navigator.clipboard.writeText(plano).then(() => {
    alert("Plano copiado com sucesso!");
  });
});

// Gerar PDF
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

// Compartilhar resultado
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

// Cálculo de macros e plano alimentar
document.getElementById('macroForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = document.getElementById('btnCalcular');
  btn.disabled = true;
  btn.innerText = "Calculando...";

  const idade = parseInt(document.getElementById('idade').value);
  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);
  const sexo = document.getElementById('sexo').value;
  const atividade = parseFloat(document.getElementById('atividade').value);
  const objetivo = document.getElementById('objetivo').value;

  let tmb = 10 * peso + 6.25 * altura - 5 * idade;
  tmb += sexo === 'masculino' ? 5 : -161;
  let tdee = tmb * atividade;

  if (objetivo === 'perder') tdee -= 500;
  if (objetivo === 'ganhar') tdee += 500;

  const proteinas = peso * 2.2;
  const gorduras = peso * 1;
  const caloriasProteinas = proteinas * 4;
  const caloriasGorduras = gorduras * 9;
  const caloriasCarbo = tdee - (caloriasProteinas + caloriasGorduras);
  const carbo = caloriasCarbo / 4;

  document.getElementById('caloriasCard').innerHTML = `<strong>Calorias:</strong><br>${Math.round(tdee)} kcal`;
  document.getElementById('proteinasCard').innerHTML = `<strong>Proteínas:</strong><br>${Math.round(proteinas)}g`;
  document.getElementById('gordurasCard').innerHTML = `<strong>Gorduras:</strong><br>${Math.round(gorduras)}g`;
  document.getElementById('carboCard').innerHTML = `<strong>Carboidratos:</strong><br>${Math.round(carbo)}g`;

  document.getElementById('resultado').classList.remove('hidden');

  const ctx = document.getElementById('graficoMacros').getContext('2d');
  if (window.macroChart) window.macroChart.destroy();
  window.macroChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Proteínas', 'Gorduras', 'Carboidratos'],
      datasets: [{
        data: [caloriasProteinas, caloriasGorduras, caloriasCarbo],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      },
      onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      }
    }
  });

  const planos = {
    perder: [
      {
        titulo: "Café da Manhã",
        opcoes: [
          "Omelete com 2 ovos (100g) + aveia (30g) + banana (90g)",
          "Iogurte natural (170g) + granola (30g) + maçã (130g)"
        ]
      },
      {
        titulo: "Almoço",
        opcoes: [
          "Frango grelhado (120g) + arroz integral (80g cru) + salada",
          "Peito de frango (120g) + quinoa (70g cru) + legumes cozidos"
        ]
      },
      {
        titulo: "Lanche",
        opcoes: [
          "Iogurte natural (170g) + castanhas (20g)",
          "Queijo branco (60g) + pera (130g)"
        ]
      },
      {
        titulo: "Jantar",
        opcoes: [
          "Peixe assado (100g) + batata doce (100g cozida) + legumes",
          "Ovos mexidos (2 unidades) + abobrinha refogada + arroz (60g cru)"
        ]
      }
    ],
    manter: [
      {
        titulo: "Café da Manhã",
        opcoes: [
          "Pão integral (2 fatias – 60g) + ovos mexidos (2 ovos – 100g) + suco (200ml)",
          "Panqueca de aveia (60g) + mel (10g) + banana (90g)"
        ]
      },
      {
        titulo: "Almoço",
        opcoes: [
          "Carne magra (150g) + arroz (100g cru) + feijão (100g cozido) + salada",
          "Frango (130g) + purê de mandioquinha (100g) + legumes"
        ]
      },
      {
        titulo: "Lanche",
        opcoes: [
          "Maçã (130g) + iogurte (170g)",
          "Biscoito de arroz (30g) + pasta de amendoim (15g)"
        ]
      },
      {
        titulo: "Jantar",
        opcoes: [
          "Frango (120g) + purê de batata (120g) + legumes",
          "Carne magra (120g) + arroz integral (80g cru) + couve refogada"
        ]
      }
    ],
    ganhar: [
      {
        titulo: "Café da Manhã",
        opcoes: [
          "Panqueca (60g aveia + 2 ovos) + banana (90g)",
          "Tapioca (80g) + ovo mexido (2 unidades) + mamão (100g)"
        ]
      },
      {
        titulo: "Almoço",
        opcoes: [
          "Arroz (120g cru) + feijão (100g cozido) + carne vermelha (150g) + legumes",
          "Massa integral (100g) + frango desfiado (150g) + brócolis"
        ]
      },
      {
        titulo: "Lanche",
        opcoes: [
          "Vitamina (200ml leite + banana + 15g pasta de amendoim)",
          "Iogurte natural (170g) + granola (30g) + uvas (100g)"
        ]
      },
      {
        titulo: "Jantar",
        opcoes: [
          "Massa cozida (100g) + frango desfiado (150g) + brócolis",
          "Batata doce (150g) + ovos mexidos (2 unidades) + legumes"
        ]
      }
    ]
  };

  const planoFormatado = planos[objetivo].map(refeicao => {
    const opcoes = refeicao.opcoes.map((op, i) => `<li><strong>Opção ${i + 1}:</strong> ${op}</li>`).join("");
    return `<h4>${refeicao.titulo}</h4><ul>${opcoes}</ul>`;
  }).join("");

  document.getElementById('planoAlimentar').innerHTML = `
    <h3>Plano Alimentar Sugerido</h3>
    ${planoFormatado}
  `;

  btn.disabled = false;
  btn.innerText = "Calcular";
});

// Registrar service worker (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registrado."))
    .catch(err => console.error("Erro ao registrar o Service Worker:", err));
}