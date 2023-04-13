using LemonTracker.Models;

namespace LemonTracker.Converters;

public interface IModuleConverter
{
    Module? ConvertToLemonModule(Stream moduleFile);
}