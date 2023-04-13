namespace LemonTracker.Models;

public class ChannelRow
{
    public char? Instrument { get; set; }
    public int? Ornament { get; set; }
    public int? Envelope { get; set; }
    public NoteData? NoteData { get; set; } 
    public int? Volume { get; set; }
    public char? Effect { get; set; }
    public char? EffectParamX { get; set; }
    public char? EffectParamY { get; set; }
    public char? EffectParamZ { get; set; }
}
