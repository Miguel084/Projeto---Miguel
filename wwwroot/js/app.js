import styles from "../css/styles.module.scss";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lembreteForm");
  const lembretesDiv = document.getElementById("lembretes");
  let lembretes = [];

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const data = new Date(document.getElementById("data").value);

    if (!nome || !data || data <= new Date()) {
      alert("Nome deve estar preenchido e Data deve ser válida e no futuro.");
      return;
    }

    const lembrete = {
      nome,
      data: data.toISOString().split("T")[0],
    };

    try {
      const response = await fetch("/api/lembretes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lembrete),
      });

      if (response.ok) {
        const novoLembrete = await response.json();
        lembretes.push(novoLembrete);
        ordenarEExibirLembretes(); // Chamada para garantir a ordenação e exibição correta após adicionar um novo lembrete
        form.reset();
      } else {
        const errorText = await response.text();
        alert(`Erro ao adicionar lembrete: ${errorText}`);
      }
    } catch (error) {
      alert(`Erro ao se comunicar com o servidor: ${error.message}`);
    }
  });

  async function carregarLembretes() {
    const response = await fetch("/api/lembretes");
    if (response.ok) {
      lembretes = await response.json();
      ordenarEExibirLembretes(); // Chamada para garantir a ordenação e exibição correta após carregar os lembretes
    }
  }

  function ordenarEExibirLembretes() {
    lembretes.sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordenação dos lembretes por data
    lembretesDiv.innerHTML = "";
    let groupedLembretes = {};

    lembretes.forEach((lembrete) => {
      const data = new Date(lembrete.data).toLocaleDateString();
      if (!groupedLembretes[data]) {
        groupedLembretes[data] = [];
      }
      groupedLembretes[data].push(lembrete);
    });

    Object.keys(groupedLembretes).forEach((data) => {
      const dataContainer = document.createElement("div");
      dataContainer.className = styles["date-group"];
      dataContainer.setAttribute("data-date", data);
      dataContainer.innerHTML = `<h2>${data}</h2><ul></ul>`;

      const ul = dataContainer.querySelector("ul");
      groupedLembretes[data].forEach((lembrete) => {
        const li = document.createElement("li");
        li.className = styles.lembrete;
        li.innerHTML = `
          <span>${lembrete.nome}</span>
          <span class="${styles.delete}" data-id="${lembrete.id}">x</span>
        `;
        ul.appendChild(li);
      });

      lembretesDiv.appendChild(dataContainer);
    });
  }

  lembretesDiv.addEventListener("click", async (event) => {
    if (event.target.classList.contains(styles.delete)) {
      const id = event.target.getAttribute("data-id");
      const response = await fetch(`/api/lembretes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        lembretes = lembretes.filter((lembrete) => lembrete.id !== id);
        ordenarEExibirLembretes(); // Chamada para garantir a ordenação e exibição correta após deletar um lembrete
      } else {
        alert("Erro ao deletar lembrete.");
      }
    }
  });

  carregarLembretes();
});
