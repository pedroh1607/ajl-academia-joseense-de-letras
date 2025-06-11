// URL do seu Apps Script publicado como Web App
const URL_API = "https://script.google.com/macros/s/AKfycbxeZJ4Z-YvcDmkva41tdAwHaNe1Eg38Iijn6sLXS2gBNWgwrDzt15vhN2Q3G7wjQMfYEg/exec";

// Evento de envio do formulário

document.getElementById("meuFormulario").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;

  // Coleta os dados do formulário
  const formData = new FormData();
  formData.append("nome", form.nome.value);
  formData.append("sobre_nome", form.sobre_nome.value);
  formData.append("pseudonimo", form.pseudonimo.value);
  formData.append("nascimento", form.nascimento.value);
  formData.append("rg", form.rg.value);
  formData.append("cell", form.cell.value);
  formData.append("endereco", form.endereco.value);
  formData.append("email", form.email.value);
  formData.append("escolaridade", form.escolaridade.value);
  formData.append("curso_superior", form.curso_superior.value);
  formData.append("biografia", form.biografia.value);
  formData.append("obras", form.obras.value);

  try {
    const res = await fetch(URL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome: form.nome.value,
        sobre_nome: form.sobre_nome.value,
        pseudonimo: form.pseudonimo.value,
        nascimento: form.nascimento.value,
        rg: form.rg.value,
        cell: form.cell.value,
        endereco: form.endereco.value,
        email: form.email.value,
        escolaridade: form.escolaridade.value,
        curso_superior: form.curso_superior.value,
        biografia: form.biografia.value,
        obras: form.obras.value
      })
    });

    const texto = await res.text();
    alert("Resposta do servidor: " + texto);
    form.reset();
    // carregarMensagens();
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao enviar. Verifique o console.");
  }
});

// Máscara para número de celular
const celular = document.getElementById('celular');
celular.addEventListener('input', function (e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d{5})(\d)/, '$1-$2');
  e.target.value = v;
});
// // Função de carregamento de mensagens (caso queira listar os cadastros na página)
// async function carregarMensagens() {
//   try {
//     const res = await fetch(URL_API);
//     const dados = await res.json();

//     const lista = document.getElementById("mensagens");
//     lista.innerHTML = "";

//     dados.slice(1).reverse().forEach(linha => {
//       const [
//         nome,
//         sobre_nome,
//         pseudonimo,
//         nascimento,
//         rg,
//         cell,
//         endereco,
//         email,
//         escolaridade,
//         curso_superior,
//         biografia,
//         obras
//       ] = linha;

//       const li = document.createElement("li");
//       li.textContent = `${nome} ${sobre_nome} (pseudônimo: ${pseudonimo}) - ${email} - ${curso_superior} - ${escolaridade}`;
//       lista.appendChild(li);
//     });
//   } catch (err) {
//     console.warn("Erro ao carregar mensagens:", err);
//   }
// }

// // Carrega mensagens ao iniciar
// carregarMensagens();
