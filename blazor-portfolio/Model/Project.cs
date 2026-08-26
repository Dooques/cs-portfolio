namespace blazor_portfolio.Model;

public record Project
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? Highlight { get; init; }
    public List<string> TechStack { get; init; } = [];
    public List<ProjectImage> Images { get; init; } = [];

    /// <summary>
    /// Labeled links shown next to the project title (e.g. "Repository",
    /// "Live Site"). A link with no Url renders as plain, non-clickable
    /// text — used for e.g. "Private Repository" on projects with no
    /// public link.
    /// </summary>
    public List<ProjectLink> Links { get; init; } = [];

    /// <summary>
    /// Overrides the automatic left/right alternation ProjectsShowcase
    /// otherwise derives from list position. Leave unset to keep
    /// alternating; set true/false to pin this project's image to a
    /// specific side regardless of where it sits in the list.
    /// </summary>
    public bool? Reversed { get; init; }

    /// <summary>
    /// Optional alternate versions of this project (e.g. "Android" vs "Web")
    /// that share a title but differ in description/tech/images/links. When
    /// populated, ProjectTemplate renders a toggle and displays whichever
    /// variant is selected instead of this record's own Description/Links/
    /// TechStack/Images/Highlight.
    /// </summary>
    public List<ProjectVariant> Variants { get; init; } = [];
}

public record ProjectVariant
{
    public string Label { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? Highlight { get; init; }
    public List<string> TechStack { get; init; } = [];
    public List<ProjectImage> Images { get; init; } = [];
    public List<ProjectLink> Links { get; init; } = [];
}

public record ProjectImage
{
    public string Url { get; init; } = string.Empty;
    public string? Caption { get; init; }
}

public record ProjectLink
{
    public string Label { get; init; } = string.Empty;
    public string? Url { get; init; }
}
