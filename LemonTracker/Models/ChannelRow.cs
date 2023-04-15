namespace LemonTracker.Models;

public class ChannelRow
{
    public char? Instrument { get; set; }
    public char? Ornament { get; set; }
    public char? Envelope { get; set; }
    public NoteData? NoteData { get; set; } 
    public char? Volume { get; set; }
    public char? Effect { get; set; }
    public char? EffectParamX { get; set; }
    public char? EffectParamY { get; set; }
    public char? EffectParamZ { get; set; }
}
