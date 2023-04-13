using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using LemonTracker.Extensions;
using LemonTracker.Models;
using static System.Int32;

namespace LemonTracker.Converters;

public class VortexModuleConverter : IModuleConverter
{
    public Module? ConvertToLemonModule(FileStream moduleFile)
    {
        var module = new Module();

        using var reader = new StreamReader(moduleFile);

        string? line;
        while ((line = reader.ReadLine()) != null)
        {
            if (line.StartsWith("[Module]"))
            {
                break;
            }
        }

        if (line == null)
        {
            throw new Exception("could not find the module metadata section in .vt2 file");
        }

        // initialize with VT2 defaults for compatibility
        var metadata = new Dictionary<string, string>()
        {
            {"VortexTrackerII", "1"},
            {"Version", "3.7"},
            {"Title", ""},
            {"Author", ""},
            {"ShowInfo", "0"},
            {"NoteTable", "2"},
            {"ChipFreq", "1750000"},
            {"IntFreq", "48828"},
            {"Speed", "3"},
            {"Noise", "HEX"},
            {"PlayOrder", "L0"},
        };

        var builder = new StringBuilder();

        while ((line = reader.ReadLine()) != null)
        {
            if (line.StartsWith("["))
            {
                break;
            }

            var isReadingValue = false;
            string? key = null;

            foreach (var c in line)
            {
                if (!isReadingValue && c == '=')
                {
                    isReadingValue = true;
                    key = builder.ToString();
                    builder.Clear();
                }
                else
                {
                    builder.Append(c);
                }
            }

            if (key != null)
            {
                var value = builder.ToString();
                metadata[key] = value;
            }

            builder.Clear();
        }

        // unsupported parameters skipped for now
        // TODO: add properties for several of those as they're necessary for correct playback

        _ = metadata["VortexTrackerII"];
        _ = metadata["Version"];
        module.Title = metadata["Title"];
        module.Author = metadata["Author"];
        _ = metadata["ShowInfo"];
        _ = metadata["NoteTable"];
        _ = metadata["ChipFreq"];
        _ = metadata["IntFreq"];
        module.InitSpeed = Parse(metadata["Speed"]);
        _ = metadata["Noise"];
        var playOrder = metadata["PlayOrder"];
        metadata.TryGetValue("Colors", out _); // not always present in the module

        //ornaments and samples skipped for now
        
        var sWhitespace = new Regex(@"\s+");
        var sNumber = new Regex(@"\d+");

        var i = 0;
        var patterns = new List<Pattern>();
        
        while(!reader.EndOfStream)
        {
            line = reader.ReadLine();

            if (line is null) continue;
            if (!line.StartsWith("[Pattern")) continue;
            
            var patternNumber = Parse(sNumber.Match(line).Value);
            
            patterns.Add(new Pattern {Number = patternNumber});
            
            while (reader.ReadLine() is { } patternLine && !string.IsNullOrEmpty(patternLine))
            {
                var rowValues = patternLine.Split('|');

                var patternRow = new PatternRow();

                var isParsedCorrectly = TryParse(rowValues[0].Trim('.'), NumberStyles.HexNumber,
                    CultureInfo.InvariantCulture, out var envelopeValue);
                if (!isParsedCorrectly) envelopeValue = 0;

                patternRow.EnvelopeValue = envelopeValue;
                
                isParsedCorrectly = TryParse(rowValues[1].Trim('.'), NumberStyles.HexNumber,
                    CultureInfo.InvariantCulture, out var noiseValue);
                if (!isParsedCorrectly) noiseValue = 0;

                patternRow.NoiseValue = noiseValue;

                //Channel A
                var trimmedRowData = sWhitespace.Replace(rowValues[2], string.Empty);
                patterns[i].Channels[0].ChannelRows.Add(MapRowData(trimmedRowData));

                //Channel B
                trimmedRowData = sWhitespace.Replace(rowValues[3], string.Empty);
                patterns[i].Channels[1].ChannelRows.Add(MapRowData(trimmedRowData));

                //Channel C
                trimmedRowData = sWhitespace.Replace(rowValues[4], string.Empty);
                patterns[i].Channels[2].ChannelRows.Add(MapRowData(trimmedRowData));
            }
            
            i++;
        }

        var patternOrder = playOrder
            .Split(',');
        
        var patternNumbersOrder = patternOrder
            .Select(x => x.TrimStart('L'))
            .Select(Parse);

        foreach (var patternNumber in patternNumbersOrder)
        {
            module.Patterns.Add(patterns.First(x => x.Number == patternNumber));
        }

        return module;
    }
    
    private static ChannelRow MapRowData(string trimmedRowData)
    {
        return new ChannelRow()
        {
            NoteData = trimmedRowData[..3].ToModuleNote(),
            Instrument = trimmedRowData[3],
            Envelope = trimmedRowData[4].HexToInt(),
            Ornament = trimmedRowData[5].HexToInt(),
            Volume = trimmedRowData[6].HexToInt(),
            Effect = trimmedRowData[7],
            EffectParamX = trimmedRowData[8],
            EffectParamY = trimmedRowData[9],
            EffectParamZ = trimmedRowData[10],
        };
    }
}