// This file should be placed in your wwwroot/js directory

window.registerChartInterop = (dotNetHelper) => {
    window.chartInterop = dotNetHelper;
};

window.getTopActiveUsers = async () => {
    try {
        const jsonData = await DotNet.invokeMethodAsync('YourProjectName', 'GetTopActiveUsers');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error getting top active users:', error);
        return [];
    }
};

window.getActivityTimeline = async () => {
    try {
        const jsonData = await DotNet.invokeMethodAsync('YourProjectName', 'GetActivityTimeline');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error getting activity timeline:', error);
        return [];
    }
};