namespace LemonTracker.Extensions;

public static class CharExtensions
{
    public static int HexToInt(this char c)
    {
        var value = ".123456789ABCDEF".IndexOf(char.ToUpper(c));
            
        return value == -1 ? 0 : value;
    }

    public static bool IsEmptyValue(this char? c) => c is '.' or null;
}