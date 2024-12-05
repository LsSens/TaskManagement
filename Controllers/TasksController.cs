using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [HttpGet]
    public IActionResult GetTasks([FromQuery] string? status)
    {
        var tasks = _context.Tasks.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            var normalizedValue = StringUtils.RemoveDiacritics(status);

            if (EnumMappings.StatusMap.TryGetValue(normalizedValue, out TaskStatus statusEnum))
            {
                tasks = tasks.Where(t => t.Status == statusEnum);
            }
            else
            {
                return BadRequest($"Valor inválido para o campo 'status': {status}");
            }
        }

        return Ok(tasks.ToList());
    }
    [HttpPut("{id}")]
    public IActionResult UpdateTask(int id, [FromBody] JsonElement updates)
    {
        var existingTask = _context.Tasks.Find(id);
        if (existingTask == null)
            return NotFound();

        // Processa os campos enviados dinamicamente
        if (updates.TryGetProperty("title", out var titleProp))
            existingTask.Title = titleProp.GetString();

        if (updates.TryGetProperty("description", out var descriptionProp))
            existingTask.Description = descriptionProp.GetString();

        if (updates.TryGetProperty("priority", out var priorityProp))
        {
            var priorityValue = priorityProp.GetString();
            if (Enum.TryParse(priorityValue, true, out PriorityLevel priorityEnum))
            {
                existingTask.Priority = priorityEnum;
            }
            else
            {
                return BadRequest($"Valor inválido para o campo 'priority': {priorityValue}");
            }
        }

        if (updates.TryGetProperty("status", out var statusProp))
        {
            var statusValue = statusProp.GetString();
            var normalizedValue = StringUtils.RemoveDiacritics(statusValue!);

            if (EnumMappings.StatusMap.TryGetValue(normalizedValue, out TaskStatus statusEnum))
            {
                existingTask.Status = statusEnum;
                existingTask.CompletedAt = statusEnum == TaskStatus.Concluído ? DateTime.UtcNow : null;
            }
            else
            {
                return BadRequest($"Valor inválido para o campo 'status': {statusValue}");
            }
        }

        _context.SaveChanges();
        return NoContent();
    }


    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var task = _context.Tasks.Find(id);
        if (task == null)
            return NotFound();

        _context.Tasks.Remove(task);
        _context.SaveChanges();
        return NoContent();
    }
}