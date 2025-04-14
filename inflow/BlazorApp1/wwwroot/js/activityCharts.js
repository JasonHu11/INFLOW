// Global chart references
var userChart = null;
var panelChart = null;
var readerChart = null;

// Utility to check if Chart.js is loaded
window.isChartJsLoaded = function() {
    return typeof Chart !== 'undefined';
};

window.testBlazorJsInterop = function() {
    console.log("JavaScript interop is working!");
    return true;
};
// Initialize charts
window.renderActivityCharts = function (userData, panelData, readerData) {
    console.log('User Data:', userData);
    console.log('Panel Data:', panelData);
    console.log('Reader Data:', readerData);
    
    try {
        // Check if Chart.js is loaded
        if (!window.isChartJsLoaded()) {
            console.error("Chart.js is not loaded. Cannot render charts.");
            return;
        }
        
        // Function to generate random colors with good contrast
        function generateColors(count) {
            const colors = [];
            const hueStep = 360 / count;
            
            for (let i = 0; i < count; i++) {
                const hue = Math.floor(i * hueStep);
                colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
            }
            
            return colors;
        }

        // Function to safely create or update charts
        function safeCreateChart(chartId, chartRef, label, labels, data) {
            console.log(`Creating chart for ${chartId} with ${labels.length} data points`);
            
            const ctx = document.getElementById(chartId);
            
            if (!ctx) {
                console.error(`Chart canvas element with ID ${chartId} not found`);
                return null;
            }
            
            // Destroy existing chart if it exists
            if (chartRef && typeof chartRef.destroy === 'function') {
                chartRef.destroy();
            }
            
            // Ensure we have valid data
            if (!labels || !data || labels.length === 0 || data.length === 0) {
                console.warn(`No data available for ${chartId}`);
                return null;
            }
            
            const colors = generateColors(labels.length);
            
            // Create new chart
            return new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        backgroundColor: colors,
                        borderColor: colors.map(color => color.replace('0.7', '1')),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Activity Count'
                            }
                        },
                        x: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Count: ${context.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Create or update the three charts
        console.log("Creating user chart...");
        userChart = safeCreateChart('userChart', userChart, 'User Activity', 
            Object.keys(userData), Object.values(userData));
        
        console.log("Creating panel chart...");
        panelChart = safeCreateChart('panelChart', panelChart, 'Panel Activity', 
            Object.keys(panelData), Object.values(panelData));
        
        console.log("Creating reader chart...");
        readerChart = safeCreateChart('readerChart', readerChart, 'Reader Activity', 
            Object.keys(readerData), Object.values(readerData));
        
        console.log("Charts rendered successfully");
    } catch (error) {
        console.error("Error creating charts:", error);
    }
};