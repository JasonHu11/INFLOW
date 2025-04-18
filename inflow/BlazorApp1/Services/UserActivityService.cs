using System;
using System.Collections.Generic;
using System.Linq;

namespace YourProjectName.Services
{
    public static class UserActivityService
    {
        // Assume a user column exists in the CSV
        public static List<UserActivityData> GetTopActiveUsers(int topCount = 10)
        {
            // Find the index of the user column
            int userColumnIndex = -1;
            int activityColumnIndex = -1;
            
            // Look for likely column names
            string[] userColumnCandidates = { "user", "username", "name", "user id", "userid" };
            string[] activityColumnCandidates = { "activity", "actions", "events", "count", "posts", "interactions" };
            
            for (int i = 0; i < CsvDataService.Headers.Count; i++)
            {
                string header = CsvDataService.Headers[i].ToLower();
                
                if (userColumnIndex == -1 && userColumnCandidates.Any(c => header.Contains(c)))
                {
                    userColumnIndex = i;
                }
                
                if (activityColumnIndex == -1 && activityColumnCandidates.Any(c => header.Contains(c)))
                {
                    activityColumnIndex = i;
                }
            }
            
            // If we couldn't find appropriate columns, use first column for user and second for activity
            if (userColumnIndex == -1 && CsvDataService.Headers.Count > 0)
            {
                userColumnIndex = 0;
            }
            
            if (activityColumnIndex == -1 && CsvDataService.Headers.Count > 1)
            {
                activityColumnIndex = 1;
            }
            
            // If we still don't have valid columns, return empty list
            if (userColumnIndex == -1 || activityColumnIndex == -1 || CsvDataService.Headers.Count <= Math.Max(userColumnIndex, activityColumnIndex))
            {
                return new List<UserActivityData>();
            }
            
            // Group by user and count activities or sum activity counts
            var activityByUser = new Dictionary<string, int>();
            
            foreach (var row in CsvDataService.CsvData)
            {
                if (row.Length <= Math.Max(userColumnIndex, activityColumnIndex)) continue;
                
                string user = row[userColumnIndex];
                
                // Try to parse activity count, default to 1 if not a number
                if (!int.TryParse(row[activityColumnIndex], out int activityCount))
                {
                    activityCount = 1;
                }
                
                if (!activityByUser.ContainsKey(user))
                {
                    activityByUser[user] = 0;
                }
                
                activityByUser[user] += activityCount;
            }
            
            // Convert to list and sort
            return activityByUser
                .Select(kv => new UserActivityData { User = kv.Key, ActivityCount = kv.Value })
                .OrderByDescending(u => u.ActivityCount)
                .Take(topCount)
                .ToList();
        }
        
        public static List<ActivityTimelineData> GetActivityTimeline()
        {
            // Find date/time column
            int dateColumnIndex = -1;
            string[] dateColumnCandidates = { "date", "time", "timestamp", "datetime" };
            
            for (int i = 0; i < CsvDataService.Headers.Count; i++)
            {
                string header = CsvDataService.Headers[i].ToLower();
                if (dateColumnCandidates.Any(c => header.Contains(c)))
                {
                    dateColumnIndex = i;
                    break;
                }
            }
            
            // If no date column found, return empty list
            if (dateColumnIndex == -1)
            {
                return new List<ActivityTimelineData>();
            }
            
            var activityByDate = new Dictionary<string, int>();
            
            foreach (var row in CsvDataService.CsvData)
            {
                if (row.Length <= dateColumnIndex) continue;
                
                string dateStr = row[dateColumnIndex];
                // Try to extract just the date part if it's a datetime
                if (DateTime.TryParse(dateStr, out DateTime date))
                {
                    dateStr = date.ToString("yyyy-MM-dd");
                }
                
                if (!activityByDate.ContainsKey(dateStr))
                {
                    activityByDate[dateStr] = 0;
                }
                
                activityByDate[dateStr]++;
            }
            
            return activityByDate
                .Select(kv => new ActivityTimelineData { Date = kv.Key, Count = kv.Value })
                .OrderBy(d => d.Date)
                .ToList();
        }
    }
    
    public class UserActivityData
    {
        public string User { get; set; }
        public int ActivityCount { get; set; }
    }
    
    public class ActivityTimelineData
    {
        public string Date { get; set; }
        public int Count { get; set; }
    }
}