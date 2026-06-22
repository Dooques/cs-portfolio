namespace blazor_portfolio.Model;

public record Project
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public List<string> TechStack { get; init; } = [];
    public List<string> Images { get; init; } = [];
}