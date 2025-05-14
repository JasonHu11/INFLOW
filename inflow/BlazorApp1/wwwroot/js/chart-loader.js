window.loadChartJs = function () {
    if (!window.chartJsLoaded) {
        window.chartJsLoaded = true;

        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
        script.integrity = 'sha512-ElRFoEQdI5Ht6kZvyzXhcN0PxWtvxuDUNqeAQAtn5dwu6F/SO36Su5zun/n';
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';

        script.onload = function () {
            window.chartJsReady = true;
        };

        script.onerror = function () {
            console.error('Failed to load Chart.js');
        };

        document.head.appendChild(script);
    }
};

window.createChart = function (canvasId, config) {
    if (!window.Chart) {
        console.error('Chart.js is not loaded');
        return;
    }

    var canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas not found: ' + canvasId);
        return;
    }

    if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
    }

    canvas.chartInstance = new Chart(canvas, config);
};