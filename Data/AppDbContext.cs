using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Converte PriorityLevel para string
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Priority)
            .HasConversion(new EnumToStringConverter<PriorityLevel>());

        // Converte TaskStatus para string
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Status)
            .HasConversion(new EnumToStringConverter<TaskStatus>());
    }

    public DbSet<TaskItem> Tasks { get; set; } = null!;
}
