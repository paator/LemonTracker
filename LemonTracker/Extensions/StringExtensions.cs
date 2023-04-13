using LemonTracker.Enums;
using LemonTracker.Models;

namespace LemonTracker.Extensions;

public static class StringExtensions
{
    public static NoteData? ToModuleNote(this string noteString)
    {
        if (noteString.Length < 3) return null;
        
        var note = noteString[..2] switch
        {
            "C-" => Note.C,
            "C#" => Note.Csharp,
            "D-" => Note.D,
            "D#" => Note.Dsharp,
            "E-" => Note.E,
            "F-" => Note.F,
            "F#" => Note.Fsharp,
            "G-" => Note.G,
            "G#" => Note.Gsharp,
            "A-" => Note.A,
            "A#" => Note.Asharp,
            "B-" => Note.B,
            "R-" => Note.Off,
            _ => Note.None
        };

        var octave = 0;
        
        if (char.IsDigit(noteString[2]))
        {
            octave = int.Parse(noteString[2].ToString());
        }
        
        return new NoteData
        {
            Note = note,
            Octave = octave,
        };
    }
}