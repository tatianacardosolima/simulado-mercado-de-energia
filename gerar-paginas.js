// Gera as páginas estáticas por tema (questoes/*.html) e o sitemap.xml a partir do questoes.js.
// Rode sempre que o questoes.js mudar:  node gerar-paginas.js
const fs = require("fs");
const path = require("path");

const BASE = "https://tatianacardosolima.github.io/simulado-mercado-de-energia/";
const AQUI = __dirname;
eval(fs.readFileSync(path.join(AQUI, "questoes.js"), "utf8").replace("const QUESTOES", "globalThis.QUESTOES"));
const Q = globalThis.QUESTOES;
const HOJE = new Date().toISOString().slice(0, 10);
const L = "ABCDEFG";

// Ordem, endereço e texto de abertura de cada tema
const TEMAS = [
  { area: "MCP", slug: "mcp", titulo: "MCP: apuração do mercado de curto prazo",
    intro: "Questões sobre a apuração do mercado de curto prazo (MCP) na CCEE: dados de entrada, energia verificada e contratada, balanço energético, recurso e requisito, cálculo NET × PLD, TMMCP, impacto do submercado de registro do contrato, modulação (flat, conforme carga, conforme MRE, declarada) e o relatório Sumário (SUM001)." },
  { area: "Comercialização varejista", slug: "comercializacao-varejista", titulo: "Comercialização varejista",
    intro: "Questões sobre a comercialização varejista na CCEE: papel do comercializador varejista, adesão e representação de consumidores, atualização cadastral, desligamento, resilição, suspensão de fornecimento (modelo tradicional e simplificado) e migração para o mercado livre." },
  { area: "MCP e PLD", slug: "mcp-e-pld", titulo: "MCP e PLD",
    intro: "Questões sobre o mercado de curto prazo e o Preço de Liquidação das Diferenças (PLD): exposição positiva e negativa, convenção de sinais e liquidação das diferenças." },
  { area: "ACR e ACL", slug: "acr-e-acl", titulo: "ACR e ACL",
    intro: "Questões sobre o Ambiente de Contratação Regulada (ACR) e o Ambiente de Contratação Livre (ACL): quem fornece a energia, uso da rede, migração para o mercado livre e comercialização varejista para o Grupo A." },
  { area: "Estrutura do SEB", slug: "estrutura-do-seb", titulo: "Estrutura do setor elétrico brasileiro",
    intro: "Questões sobre a estrutura do setor elétrico brasileiro (SEB): geração, transmissão e distribuição, o Sistema Interligado Nacional (SIN) e os submercados." },
  { area: "Instituições", slug: "instituicoes", titulo: "Instituições do setor elétrico",
    intro: "Questões sobre as instituições do setor elétrico: CCEE, ANEEL, ONS, MME e EPE, e o papel de cada uma." },
  { area: "Comercialização", slug: "comercializacao", titulo: "Comercialização de energia",
    intro: "Questões sobre comercialização de energia elétrica: papel da comercializadora, entrega física da energia, sazonalização e flexibilidade contratual." },
  { area: "Medição e ETRM", slug: "medicao-e-etrm", titulo: "Medição e ETRM",
    intro: "Questões sobre medição de energia e sistemas ETRM (Energy Trading and Risk Management): contratos, posição energética, TUSD e TUST." },
  { area: "Unidades", slug: "unidades", titulo: "Unidades de energia e potência",
    intro: "Questões de cálculo com unidades do setor elétrico: MW, MWh, MW médio, horas do mês e valor nominal de contratos." },
];

// Embaralha as alternativas de forma fixa por questão (a mesma ordem a cada geração),
// para a resposta certa não cair sempre na mesma letra.
function ordemFixa(q, i) {
  let s = (i + 1) * 2654435761 % 4294967296;
  const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const ord = q.op.map((_, j) => j);
  for (let k = ord.length - 1; k > 0; k--) { const r = Math.floor(rnd() * (k + 1)); [ord[k], ord[r]] = [ord[r], ord[k]]; }
  return { op: ord.map(j => q.op[j]), c: ord.indexOf(q.c) };
}

const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Toda área do questoes.js precisa ter um tema aqui
const semTema = [...new Set(Q.map(q => q.area))].filter(a => !TEMAS.some(t => t.area === a));
if (semTema.length) { console.error("Áreas sem tema em gerar-paginas.js:", semTema); process.exit(1); }

const CSS = `
:root{--bg:#faf7fb;--card:#fff;--ink:#2a1638;--muted:#6b5a78;--line:#ebe2ef;--brand:#3B1E54;--accent:#C2306E;--soft:#fbeaf0;--ok:#1f8a4c}
@media (prefers-color-scheme:dark){:root{--bg:#150c1d;--card:#21152c;--ink:#f1e9f5;--muted:#b7a6c4;--line:#36264a;--brand:#2a1540;--accent:#F06A9E;--soft:#3d1a34;--ok:#4cc584}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.topo{background:var(--brand);color:#fff}
.in{max-width:760px;margin:0 auto;padding:16px}
.topo a{color:#F4C0D1;text-decoration:none;font-size:14px}
.topo h1{margin:6px 0 0;font-size:22px;line-height:1.3}
main{max-width:760px;margin:0 auto;padding:20px 16px 60px}
a{color:var(--accent)}
.cta{display:inline-block;margin:6px 0 18px;padding:10px 16px;border-radius:10px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600}
.q{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:12px}
.q h2{font-size:16px;margin:0 0 8px}
.q .n{display:block;font-size:12px;color:var(--muted);font-weight:400;margin-bottom:2px}
.q ol{margin:0 0 8px;padding-left:0;list-style:none}
.q li{margin:4px 0}
details{font-size:15px}
summary{cursor:pointer;color:var(--accent);font-weight:600}
.resp{margin:8px 0 0;padding:10px 12px;border-radius:10px;background:var(--soft)}
.resp b{color:var(--ok)}
.temas li{margin:6px 0}
.muted{color:var(--muted);font-size:14px}
footer{color:var(--muted);font-size:12px;text-align:center;margin-top:24px}
`;

const GA = `<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
var c=null;try{c=localStorage.getItem("simulado-cookies")}catch(e){}
gtag("consent","default",{analytics_storage:c==="aceito"?"granted":"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
gtag("js",new Date());gtag("config","G-HYV93Y2XR6");
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HYV93Y2XR6"></script>`;

function pagina({ titulo, descricao, url, h1, corpo, jsonld }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}og-image.png">
<meta property="og:locale" content="pt_BR">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
${GA}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
<style>${CSS}</style>
</head>
<body>
<div class="topo"><div class="in">
  <a href="../">← Simulado CCEE · Mercado de Energia</a>
  <h1>${esc(h1)}</h1>
</div></div>
<main>
${corpo}
<footer>Feito por <a href="https://www.linkedin.com/in/tatiana-cardoso-lima/" target="_blank" rel="noopener">Tatiana Cardoso Lima</a> · <a href="../">Simulado CCEE grátis</a><br>Questões autorais para estudo — não são oficiais da CCEE.</footer>
</main>
</body>
</html>
`;
}

const dir = path.join(AQUI, "questoes");
fs.mkdirSync(dir, { recursive: true });

// Uma página por tema
for (const t of TEMAS) {
  const itens = Q.map((q, i) => ({ q, i })).filter(x => x.q.area === t.area);
  const url = `${BASE}questoes/${t.slug}.html`;
  const blocos = itens.map(({ q, i }) => { const m = ordemFixa(q, i); return `<section class="q" id="q${i + 1}">
  <h2><span class="n">Questão nº ${i + 1}</span>${esc(q.q)}</h2>
  <ol>${m.op.map((o, j) => `<li>${L[j]}) ${esc(o)}</li>`).join("")}</ol>
  <details><summary>Ver resposta</summary><p class="resp"><b>Resposta: ${L[m.c]}) ${esc(m.op[m.c])}</b><br>${esc(q.exp)}</p></details>
</section>`; }).join("\n");
  const corpo = `<p>${esc(t.intro)}</p>
<p class="muted">${itens.length} questões comentadas, de múltipla escolha, para estudar para a Certificação de Operadores da CCEE. No simulado, as alternativas são embaralhadas e você pode fazer uma prova cronometrada.</p>
<a class="cta" href="../">Fazer o simulado CCEE grátis</a>
${blocos}
<p><a href="./">Ver outros temas</a></p>`;
  const jsonld = {
    "@context": "https://schema.org", "@type": "Quiz", "name": `Questões de ${t.titulo} · Simulado CCEE`,
    "inLanguage": "pt-BR", "url": url, "educationalLevel": "Certificação de Operadores da CCEE",
    "about": { "@type": "Thing", "name": t.titulo },
    "hasPart": itens.map(({ q }) => ({
      "@type": "Question", "name": q.q, "eduQuestionType": "Multiple choice",
      "acceptedAnswer": { "@type": "Answer", "text": q.op[q.c] },
      "suggestedAnswer": q.op.filter((_, j) => j !== q.c).map(o => ({ "@type": "Answer", "text": o })),
    })),
  };
  fs.writeFileSync(path.join(dir, `${t.slug}.html`), pagina({
    titulo: `Questões de ${t.titulo} · Simulado CCEE 2027`,
    descricao: `${itens.length} questões comentadas de ${t.titulo} para a Certificação de Operadores da CCEE. Simulado grátis com gabarito e explicação.`,
    url, h1: `Questões de ${t.titulo}`, corpo, jsonld,
  }));
}

// Índice dos temas
const lista = TEMAS.map(t => {
  const n = Q.filter(q => q.area === t.area).length;
  return `<li><a href="${t.slug}.html">${esc(t.titulo)}</a> <span class="muted">(${n} questões)</span></li>`;
}).join("\n");
fs.writeFileSync(path.join(dir, "index.html"), pagina({
  titulo: "Questões por tema · Simulado CCEE 2027 grátis",
  descricao: `${Q.length} questões comentadas para a Certificação de Operadores da CCEE, separadas por tema: MCP, PLD, comercialização varejista, ACR e ACL e mais.`,
  url: `${BASE}questoes/`, h1: "Questões do simulado CCEE por tema",
  corpo: `<p>São ${Q.length} questões de múltipla escolha, todas com resposta comentada, para estudar para a Certificação de Operadores da CCEE. Escolha um tema:</p>
<ul class="temas">${lista}</ul>
<a class="cta" href="../">Fazer o simulado CCEE grátis</a>`,
}));

// Sitemap
const urls = [BASE, `${BASE}questoes/`, ...TEMAS.map(t => `${BASE}questoes/${t.slug}.html`)];
fs.writeFileSync(path.join(AQUI, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${HOJE}</lastmod></url>`).join("\n")}
</urlset>
`);

console.log(`Geradas ${TEMAS.length} páginas de tema + índice + sitemap (${Q.length} questões).`);
