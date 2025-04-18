using Microsoft.JSInterop;
using System.Threading.Tasks;
using System.Collections.Generic;
using YourProjectName.Services;
using System.Text.Json;

namespace YourProjectName.Services
{
    public class ChartInteropService
    {
        private readonly IJSRuntime _jsRuntime;

        public ChartInteropService(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        [JSInvokable]
        public static string GetTopActiveUsers()
        {
            var data = UserActivityService.GetTopActiveUsers();
            
            // Convert to the format expected by the chart
            var chartData = data.Select(d => new { name = d.User, activity = d.ActivityCount }).ToList();
            
            return JsonSerializer.Serialize(chartData);
        }

        [JSInvokable]
        public static string GetActivityTimeline()
        {
            var data = UserActivityService.GetActivityTimeline();
            
            // Convert to the format expected by the chart
            var chartData = data.Select(d => new { date = d.Date, count = d.Count }).ToList();
            
            return JsonSerializer.Serialize(chartData);
        }

        public async Task InitializeChartInterop()
        {
            await _jsRuntime.InvokeVoidAsync(
                "window.registerChartInterop", 
                DotNetObjectReference.Create(this));
        }
    }
}