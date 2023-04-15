using LemonTracker.Enums;

namespace LemonTracker.Models;

public class NoteData
{
    public Note Note { get; set; }
    public int Octave { get; set; }
    
    public override string ToString()
    {
        var noteString = Note switch
        {
            Note.C => "C-",
            Note.Csharp => "C#",
            Note.D => "D-",
            Note.Dsharp => "D#",
            Note.E => "E-",
            Note.F => "F-",
            Note.Fsharp => "F#",
            Note.G => "G-",
            Note.Gsharp => "G#",
            Note.A => "A-",
            Note.Asharp => "A#",
            Note.B => "B-",
            Note.Off => "R-",
            _ => "--"
        };
        
        return $"{noteString}{(Note == Note.None ? "-" : Octave)}";
    }
}