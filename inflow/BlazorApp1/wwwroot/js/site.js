// Load Chart.js library dynamically
window.loadChartJS = async function() {
    await loadScript('https://cdn.jsdelivr.net/npm/chart.js');
    await loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0');
    await loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-gradient');
};

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Bar Chart
window.renderBarChart = function(canvasId, labels, data, backgroundColor, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: backgroundColor.replace('0.7', '1'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Activity Count'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: label.split(' ').slice(1).join(' ')
                    }
                }
            }
        }
    });
};

// Line Chart
window.renderLineChart = function(canvasId, labels, data, borderColor, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: borderColor,
                backgroundColor: borderColor.replace('0.7', '0.2'),
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Activity Count'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
};

// Pie Chart
window.renderPieChart = function(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(83, 102, 255, 0.7)',
                    'rgba(255, 99, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
};

// Heatmap Chart
window.renderHeatmap = function(canvasId, xLabels, yLabels, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Generate gradient color
    function generateGradient(ctx, area, minColor, maxColor) {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        gradient.addColorStop(0, minColor);
        gradient.addColorStop(1, maxColor);
        return gradient;
    }
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: yLabels,
            datasets: xLabels.map((xLabel, xIndex) => {
                return {
                    label: xLabel,
                    data: yLabels.map((yLabel, yIndex) => {
                        return {
                            x: yLabel,
                            y: data[yIndex][xIndex]
                        };
                    }),
                    backgroundColor: generateGradient(ctx, ctx.chart.area, 'rgba(255, 255, 255, 0.1)', 'rgba(255, 99, 132, 0.7)')
                };
            })
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `Hour: ${context[0].dataset.label}`;
                        },
                        label: function(context) {
                            return `Panel: ${context.raw.x}, Activity: ${context.raw.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Panels'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Activity Count'
                    }
                }
            }
        }
    });
};