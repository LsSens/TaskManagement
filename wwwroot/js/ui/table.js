import { fetchTaskById, deleteTaskById } from "../api/tasks.js";
import { showAlert } from "../main.js";
import { openTaskModal } from "./modals.js";

export function initializeTaskTable() {
  const table = $("#tasksTable").DataTable({
    ajax: {
      url: "/api/tasks",
      data: function (d) {
        const status = $("#statusFilter").val();
        if (status) {
          d.status = status;
        }
      },
    },
    columns: [
      { data: "title" },
      { data: "description" },
      { data: "priority" },
      {
        data: "status",
        render: function (status, type, row) {
          if (status === "Concluído" && row.completedAt) {
            const completedDate = new Date(row.completedAt);
            completedDate.setHours(completedDate.getHours() - 3);

            const formattedDate = new Date(completedDate).toLocaleString(
              "pt-BR",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );
            return `
              <div>
                <span>${status}</span>
                <br>
                <small class="text-muted">${formattedDate}</small>
              </div>
            `;
          }
          return `<span>${status}</span>`;
        },
      },
      {
        data: null,
        render: function (data) {
          return `
                        <div class="btn-actions">
                            <button class="btn btn-warning btn-sm edit-btn" data-id="${data.id}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${data.id}" data-title="${data.title}">Excluir</button>
                        </div>
                    `;
        },
      },
    ],
    paging: true,
    searching: true,
    ordering: true,
    language: {
      decimal: ",",
      thousands: ".",
      search: "",
      info: "Exibindo _START_ a _END_ de _TOTAL_ registros",
      lengthMenu:
        "<span>Exibir</span> _MENU_ <span style='width: 80px'>Por página</span>",
      infoEmpty: "Nenhum registro disponível",
      infoFiltered: "(filtrado de _MAX_ registros no total)",
      zeroRecords: "Nenhum registro encontrado",
      emptyTable: "Nenhuma informação disponível na tabela",
      paginate: {
        first: "Primeiro",
        previous: "Anterior",
        next: "Próximo",
        last: "Último",
      },
    },
    dom: '<"d-flex justify-content-between align-items-center"<"d-flex align-items-center"l><"d-flex align-items-center justify-content-center"<"#custom-search-wrapper">>t<"#statusFilterWrapper">>t<"d-flex justify-content-between"ip>',
  });

  $("#custom-search-wrapper").html(`
    <div class="input-group">
      <div class="form-outline">
        <input id="search-input" type="search" class="form-control" placeholder="Buscar" />
      </div>
    </div>
  `);

  $("#statusFilterWrapper").html(`
    <select id="statusFilter" class="form-select form-select-sm ms-2" style="max-width: 144px;">
      <option value="">Todos os Status</option>
      <option value="pendente">Pendente</option>
      <option value="concluido">Concluído</option>
    </select>
  `);

  $("#search-input").on("keyup", function () {
    const searchTerm = $(this).val();
    table.search(searchTerm).draw();
  });

  $("#statusFilter").on("change", function () {
    table.ajax.reload();
  });

  $("#tasksTable").on("click", ".edit-btn", async function () {
    const taskId = $(this).data("id");
    try {
      const task = await fetchTaskById(taskId);
      openTaskModal(task);
    } catch (error) {
      const errorMessage = error.message || "Erro ao carregar tarefas";
      showAlert(errorMessage, "danger");
    }
  });

  $("#tasksTable").on("click", ".delete-btn", function () {
    const taskId = $(this).data("id");
    const taskTitle = $(this).data("title");

    $("#deleteTaskMessage").text(
      `Tem certeza que deseja deletar a tarefa "${taskTitle}"?`
    );
    $("#confirmDeleteBtn").data("id", taskId);

    $("#deleteTaskModal").modal("show");
  });

  $("#confirmDeleteBtn").click(async function () {
    const taskId = $(this).data("id");

    try {
      const response = await deleteTaskById(taskId);
      table.ajax.reload();
      $("#deleteTaskModal").modal("hide");
      showAlert(response.message || "Tarefa excluída com sucesso!", "success");
    } catch (error) {
      showAlert(error.message || "Erro ao excluir a tarefa!", "danger");
    }
  });

  return table;
}
