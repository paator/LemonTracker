namespace LemonTracker.Models;

public class Pattern
{
    public int Number { get; set; }

    public List<Channel> Channels { get; set; } = new()
    {
        new Channel(),
        new Channel(),
        new Channel(),
    };

    public List<PatternRow> PatternRows { get; set; } = new();
    public bool IsLoopPoint { get; set; }
}