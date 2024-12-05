import { fetchTaskById, deleteTaskById } from "../api/tasks.js";
import { openTaskModal } from "./modals.js";

export function initializeTaskTable() {
  const table = $("#tasksTable").DataTable({
    ajax: "/api/tasks",
    columns: [
      { data: "title" },
      { data: "description" },
      { data: "priority" },
      { data: "status" },
      {
        data: null,
        render: function (data) {
          return `
                        <div class="btn-actions">
                            <button class="btn btn-warning btn-sm edit-btn" data-id="${data.id}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${data.id}">Excluir</button>
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
      search: "Buscar:",
      lengthMenu: "Exibir _MENU_ registros por página",
      info: "Exibindo _START_ a _END_ de _TOTAL_ registros",
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
  });

  $("#tasksTable").on("click", ".edit-btn", async function () {
    const taskId = $(this).data("id");
    try {
      const task = await fetchTaskById(taskId);
      openTaskModal(task);
    } catch (error) {
      alert(error.message);
    }
  });

  $("#tasksTable").on("click", ".delete-btn", async function () {
    const taskId = $(this).data("id");
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await deleteTaskById(taskId);
        table.ajax.reload();
      } catch (error) {
        alert(error.message);
      }
    }
  });

  return table;
}
