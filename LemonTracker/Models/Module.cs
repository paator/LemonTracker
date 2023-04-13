namespace LemonTracker.Models;

public class Module
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int InitSpeed { get; set; } = 3;
    public List<Pattern> Patterns { get; set; } = new();
    public List<Sample> Samples { get; set; } = new();
    public List<Ornament> Ornaments { get; set; } = new();
}