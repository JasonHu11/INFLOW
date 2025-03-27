// Services/CsvDataService.cs
namespace YourProjectName.Services;

public static class CsvDataService
{
    public static event Action? DataLoaded;
    
    private static List<string[]>? _csvData;
    private static List<string>? _headers;

    public static List<string[]>? CsvData
    {
        get => _csvData;
        set
        {
            _csvData = value;
            DataLoaded?.Invoke();
        }
    }

    public static List<string>? Headers
    {
        get => _headers;
        set
        {
            _headers = value;
            DataLoaded?.Invoke();
        }
    }

    public static void ClearData()
    {
        _csvData = null;
        _headers = null;
    }
}