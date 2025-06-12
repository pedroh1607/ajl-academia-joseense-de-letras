// transfer.js

// 1. Defina a URL do seu Apps Script Web App publicado:
const URL_API = "https://script.google.com/macros/s/AKfycbxQDEDZdln5m5T7si2emcZMFC5fTDCap1eCCb_Xa0bsHp7mUrmehzcg9jI5gA_yE-pKMg/exec";

// 2. Navegação entre páginas do site (SPA)
function mostrarPagina(id, event) {
  document.querySelectorAll('.pagina').forEach(sec => sec.classList.remove('ativa'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('ativa');
  document.querySelectorAll('nav .button').forEach(btn => btn.classList.remove('ativo'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('ativo');
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Confirmação de existência do formulário
  const form = document.getElementById("meuFormulario");
  if (!form) {
    console.warn("Formulário com id 'meuFormulario' não encontrado no DOM.");
  }

  // Máscara para RG: apenas dígitos, até 12 caracteres
  const rgInput = document.getElementById("rg");
  if (rgInput) {
    rgInput.addEventListener("input", function(e) {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 12) v = v.slice(0, 12);
      e.target.value = v;
    });
  } else {
    console.warn("Input RG (id='rg') não encontrado.");
  }

  // Máscara para CPF: 999.999.999-99
  const cpfInput = document.getElementById("cpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", function(e) {
      let digits = e.target.value.replace(/\D/g, "");
      if (digits.length > 11) digits = digits.slice(0, 11);
      let formatted = "";
      if (digits.length <= 3) {
        formatted = digits;
      } else if (digits.length <= 6) {
        formatted = digits.slice(0, 3) + '.' + digits.slice(3);
      } else if (digits.length <= 9) {
        formatted = digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6);
      } else {
        formatted = digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6, 9) + '-' + digits.slice(9);
      }
      e.target.value = formatted;
    });
  } else {
    console.warn("Input CPF (id='cpf') não encontrado.");
  }

  // Máscara para celular: (99) 9999-9999 ou (99) 99999-9999
  const cellInput = document.getElementById("cell");
  if (cellInput) {
    cellInput.addEventListener("input", function(e) {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
      } else if (v.length > 5) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
      } else {
        v = v.replace(/^(\d*)$/, "($1");
      }
      e.target.value = v;
    });
  } else {
    console.warn("Input celular (id='cell') não encontrado.");
  }

  // Envio do formulário
  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      // Lê valores do formulário, com verificação de existência
      const getValue = (field) => {
        const el = form.querySelector(`[name="${field}"]`);
        if (!el) console.warn(`Campo '${field}' não encontrado no formulário.`);
        return el ? el.value.trim() : "";
      };
      const nome = getValue('nome');
      const sobre_nome = getValue('sobre_nome');
      const pseudonimo = getValue('pseudonimo');
      const nascimento = getValue('nascimento');
      const rg = getValue('rg');
      const cpf = getValue('cpf');
      const cell = getValue('cell');
      const endereco = getValue('endereco');
      const email = getValue('email');
      const escolaridade = getValue('escolaridade');
      const curso_superior = getValue('curso_superior');
      const biografia = getValue('biografia');
      const obras = getValue('obras');

      // Validação mínima no front
      if (!nome || !email || !pseudonimo || !biografia) {
        alert("Preencha nome, e-mail, pseudônimo e biografia.");
        return;
      }

      console.log("DEBUG: Valores do formulário:", { nome, sobre_nome, pseudonimo, nascimento, rg, cpf, cell, endereco, email, escolaridade, curso_superior, biografia, obras });

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

      try {
        const res = await fetch(URL_API, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString()
        });
        const texto = await res.text();
        console.log("DEBUG: Resposta do servidor:", texto);
        alert(texto);
        form.reset();
        if (typeof carregarMensagens === "function") carregarMensagens();
      } catch (err) {
        console.error("Erro ao enviar:", err);
        alert("Erro ao enviar. Veja console.");
      }
    });
  }

  // Função opcional para carregar cadastros via GET
  async function carregarMensagens() {
    const lista = document.getElementById("mensagens");
    if (!lista) return;
    lista.innerHTML = "";
    try {
      const res = await fetch(URL_API);
      if (!res.ok) throw new Error("Erro na resposta GET");
      const dados = await res.json();
      dados.slice(1).reverse().forEach(linha => {
        if (!Array.isArray(linha) || linha.length < 13) return;
        const [nome, sobre_nome, pseudonimo, nascimento, rg, cpf, cell, endereco, email, escolaridade, curso_superior, biografia, obras] = linha;
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
    } catch (err) {
      console.warn("Não foi possível carregar cadastros:", err);
    }
  }

  // Carrega automaticamente se houver lista
  carregarMensagens();
});
