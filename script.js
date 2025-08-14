document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  const modoSelect = document.getElementById('modo');
  const consultaCampos = document.getElementById('consultaCampos');
  const manualCampos = document.getElementById('manualCampos');

  modoSelect.addEventListener('change', function () {
    consultaCampos.classList.toggle('hidden', this.value !== 'consulta');
    manualCampos.classList.toggle('hidden', this.value !== 'manual');
  });

  document.getElementById('formularioReserva').addEventListener('submit', async function (e) {
    e.preventDefault();
    const matricula = document.getElementById('matricula').value;
    const centro = document.getElementById('centro').value;
    const modo = modoSelect.value;
    let payload = { matricula, centro };
    let url = "";

    if (modo === 'consulta') {
      payload.ordem = document.getElementById('ordem').value;
      url = "https://bemol.app.n8n.cloud/webhook/consultaOrdemVenda";
    } else if (modo === 'manual') {
      payload.dados = document.getElementById('dados').value;
      url = "https://bemol.app.n8n.cloud/webhook/Reservatestesv2";
    } else {
      alert("Por favor, selecione um modo de preenchimento.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("Dados enviados com sucesso!");
        this.reset();
        consultaCampos.classList.add('hidden');
        manualCampos.classList.add('hidden');
      } else {
        alert("Erro ao enviar os dados.");
      }
    } catch (error) {
      alert("Falha na conexão.");
    }
  });

  document.getElementById('form-estoque').addEventListener('submit', async function (e) {
    e.preventDefault();
    const codigo = document.getElementById('codigo').value;
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = "🔄 Consultando...";
    try {
      const response = await fetch("https://bemol.app.n8n.cloud/webhook/Estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo_produto: codigo })
      });
      const data = await response.json();
      resultado.innerHTML = data.html || `<p class="erro">❌ ${data.mensagem || "Erro inesperado."}</p>`;
    } catch {
      resultado.innerHTML = `<p class="erro">❌ Falha na conexão.</p>`;
    }
  });

  document.getElementById('form-ordem').addEventListener('submit', async function (e) {
    e.preventDefault();
    const ordem = document.getElementById('ordem_venda').value;
    const resultado = document.getElementById('resultado-ordem');
    resultado.innerHTML = "🔄 Consultando...";
    try {
      const response = await fetch("https://bemol.app.n8n.cloud/webhook/consultaOrdem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordem_venda: ordem })
      });
      const data = await response.json();
      resultado.innerHTML = data.html || `<p class="erro">❌ ${data.mensagem || "Erro inesperado."}</p>`;
    } catch {
      resultado.innerHTML = `<p class="erro">❌ Falha na conexão.</p>`;
    }
  });

  document.getElementById('form-ia').addEventListener('submit', async function (e) {
    e.preventDefault();
    const matricula = document.getElementById('matricula-ia').value;
    const ordem = document.getElementById('ordem-ia').value;
    const resultado = document.getElementById('resultado-ia');
    resultado.innerHTML = "🔄 Enviando...";
    try {
      const response = await fetch("https://bemol.app.n8n.cloud/webhook/consultaOrdemv2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, ordem })
      });
      const data = await response.json();
      if (response.ok) {
        resultado.innerHTML = `<p style="color: green; font-weight: bold;">✅ Dados enviados com sucesso!</p>`;
      } else {
        resultado.innerHTML = `<p class="erro">❌ ${data.mensagem || "Erro inesperado."}</p>`;
      }
    } catch {
      resultado.innerHTML = `<p class="erro">❌ Falha na conexão.</p>`;
    }
  });
});
