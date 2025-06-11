// transfer.js

// 1. Defina aqui a URL do seu Apps Script Web App implantado:
const URL_API = "https://script.google.com/macros/s/AKfycbzbdF3g7_S7lioqsT3DqSW5xBBNntDvQP7R_sxpIgFcytFVsp6qD5Jm2BaSIJrQL-zb2g/exec";

// 2. Função de navegação: mostra a seção com id e marca o botão como ativo
function mostrarPagina(id, event) {
  // Esconde todas as seções com class "pagina"
  document.querySelectorAll('.pagina').forEach(sec => sec.classList.remove('ativa'));
  // Mostra a seção desejada
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('ativa');
  // Ajusta botão ativo: remove de todos, adiciona ao clicado
  document.querySelectorAll('nav .button').forEach(btn => btn.classList.remove('ativo'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('ativo');
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 3. Máscara de RG: apenas dígitos, até 12
  const rgInput = document.getElementById("rg");
  if (rgInput) {
    rgInput.addEventListener("input", function(e) {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 12) v = v.slice(0, 12);
      e.target.value = v;
    });
  }

  // 4. Máscara de CPF: formata como 999.999.999-99
  const cpfInput = document.getElementById("cpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", function(e) {
      let digits = e.target.value.replace(/\D/g, "");
      if (digits.length > 11) digits = digits.slice(0, 11);
      let formatted = "";
      if (digits.length <= 3) {
        formatted = digits;
      } else if (digits.length <= 6) {
        formatted = digits.slice(0, 3) + "." + digits.slice(3);
      } else if (digits.length <= 9) {
        formatted = digits.slice(0, 3) + "." +
                    digits.slice(3, 6) + "." +
                    digits.slice(6);
      } else {
        formatted = digits.slice(0, 3) + "." +
                    digits.slice(3, 6) + "." +
                    digits.slice(6, 9) + "-" +
                    digits.slice(9);
      }
      e.target.value = formatted;
    });
  }

  // 5. Máscara de celular: (99) 99999-9999
  const cellInput = document.getElementById("cell");
  if (cellInput) {
    cellInput.addEventListener("input", function(e) {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/^(\d{2})(\d)/, "($1) $2");
      v = v.replace(/(\d{5})(\d)/, "$1-$2");
      e.target.value = v;
    });
  }

  // 6. Envio do formulário
  const form = document.getElementById("meuFormulario");
  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();

      // Lê valores do formulário
      const nome = form.nome.value.trim();
      const sobre_nome = form.sobre_nome.value.trim();
      const pseudonimo = form.pseudonimo.value.trim();
      const nascimento = form.nascimento.value; // yyyy-mm-dd ou "" se vazio
      const rg = form.rg.value.trim();
      const cpf = form.cpf.value.trim();
      const cell = form.cell.value.trim();
      const endereco = form.endereco.value.trim();
      const email = form.email.value.trim();
      const escolaridade = form.escolaridade.value;
      const curso_superior = form.curso_superior.value;
      const biografia = form.biografia.value.trim();
      const obras = form.obras.value.trim();

      // Validação mínima no front (opcional)
      if (!nome || !email || !pseudonimo || !biografia) {
        alert("Preencha nome, e-mail, pseudônimo e biografia.");
        return;
      }

      // Debug: verifique valor de CPF antes de enviar
      console.log("DEBUG: CPF lido no front:", cpf);

      // Monta corpo x-www-form-urlencoded
      const body = new URLSearchParams({
        nome,
        sobre_nome,
        pseudonimo,
        nascimento,
        rg,
        cpf,
        cell,
        endereco,
        email,
        escolaridade,
        curso_superior,
        biografia,
        obras
      });

      console.log("DEBUG: Payload do POST:", body.toString());

      try {
        const res = await fetch(URL_API, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString()
        });
        // Tenta ler como texto; se seu doPost retornar JSON, use res.json()
        const texto = await res.text();
        console.log("Resposta do servidor:", texto);
        alert(texto);
        form.reset();
        // Após reset, volte para a seção inicial ou mantenha em cadastro?
        // Ex: mostrarPagina('inicio');
        // Atualiza lista de cadastros (se usar doGet)
        if (typeof carregarMensagens === "function") {
          carregarMensagens();
        }
      } catch(err) {
        console.error("Erro ao enviar:", err);
        alert("Erro ao enviar. Veja console.");
      }
    });
  }
    
  // 7. Função para carregar cadastros (GET), se seu Apps Script tem doGet retornando JSON array
  async function carregarMensagens() {
    const lista = document.getElementById("mensagens");
    if (!lista) return;
    lista.innerHTML = "";
    try {
      const res = await fetch(URL_API);
      if (!res.ok) throw new Error("Resposta não-ok");
      const dados = await res.json(); // espera array de arrays
      // Remove cabeçalho (linha 0) e mostra do mais novo ao mais antigo
      dados.slice(1).reverse().forEach(linha => {
        // Destructure conforme ordem do appendRow no Apps Script:
        // [nome, sobre_nome, pseudonimo, nascimento, rg, cpf, cell, endereco, email, escolaridade, curso_superior, biografia, obras]
        const [
          nome, sobre_nome, pseudonimo, nascimento,
          rg, cpf, cell, endereco,
          email, escolaridade, curso_superior, biografia, obras
        ] = linha;
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${nome} ${sobre_nome}</strong> (Pseudônimo: ${pseudonimo})<br>
          RG: ${rg}<br>
          CPF: ${cpf}<br>
          Email: ${email}<br>
          Celular: ${cell}<br>
          Data de Nascimento: ${nascimento}<br>
          Escolaridade: ${escolaridade} - ${curso_superior}<br>
          Endereço: ${endereco}<br><br>
          <strong>Biografia:</strong><br>${biografia}<br><br>
          <strong>Obras:</strong><br>${obras}
        `;
        lista.appendChild(li);
      });
    } catch(err) {
      console.warn("Não foi possível carregar cadastros:", err);
    }
  }

  // 8. Chama carregarMensagens() ao iniciar (opcional; se desejar listar logo)
  carregarMensagens();
});
