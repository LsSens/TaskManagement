import { initializeTaskTable } from "./ui/table.js";
import { openTaskModal, closeTaskModal } from "./ui/modals.js";
import { saveTask } from "./api/tasks.js";

$(document).ready(function () {
  const taskTable = initializeTaskTable();

  $("#createTaskBtn").click(() => openTaskModal());

  $("#taskForm").submit(async function (e) {
    e.preventDefault();

    const taskId = $("#taskId").val();
    const taskData = {
      title: $("#taskTitle").val(),
      description: $("#taskDescription").val(),
      priority: $("#taskPriority").val(),
      status: $("#taskStatus").val(),
    };

    try {
      await saveTask(taskId, taskData);
      closeTaskModal();
      taskTable.ajax.reload();
    } catch (error) {
      alert(error.message);
    }
  });
});
