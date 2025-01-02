const urlReportes = 'http://localhost:8080/reportes/';

function errorFunction(status, response) {
    alert("Error " + status + ":\n" + response.error);
}

function convertMapToChartData(dataMap) {
    const labels = Object.keys(dataMap);
    const data = Object.values(dataMap);
    return { labels, data };
}

function loadRecetasTipoUsoBar() {
    makeRequest(
        `${urlReportes}recetas-momento`,
        Method.GET,
        null,
        ContentType.JSON,
        CallType.PRIVATE,
        (data) => {
            const chartData = convertMapToChartData(data);
            new Chart(document.getElementById('recetasTipoUsoBar'), {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Cantidad de Recetas',
                        data: chartData.data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        },
        errorFunction
    );
}


function loadRecetasTipoUsoPie() {
    makeRequest(
        `${urlReportes}recetas-momento`,
        Method.GET,
        null,
        ContentType.JSON,
        CallType.PRIVATE,
        (data) => {
            const chartData = convertMapToChartData(data);
            new Chart(document.getElementById('recetasTipoUsoPie'), {
                type: 'pie',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                    }]
                },
                options: {
                    responsive: true
                }
            });
        },
        errorFunction
    );
}


function loadRecetasTipoAlimentosBar() {
    makeRequest(
        `${urlReportes}recetas-tipo-alimento`,
        Method.GET,
        null,
        ContentType.JSON,
        CallType.PRIVATE,
        (data) => {
            const chartData = convertMapToChartData(data);
            new Chart(document.getElementById('recetasTipoAlimentosBar'), {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Cantidad de Recetas',
                        data: chartData.data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        },
        errorFunction
    );
}

function loadRecetasTipoAlimentosPie() {
    makeRequest(
        `${urlReportes}recetas-tipo-alimento`,
        Method.GET,
        null,
        ContentType.JSON,
        CallType.PRIVATE,
        (data) => {
            const chartData = convertMapToChartData(data);
            new Chart(document.getElementById('recetasTipoAlimentosPie'), {
                type: 'pie',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.data,
                        
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FFA500', '#800080']
                    }]
                },
                options: {
                    responsive: true
                }
            });
        },
        errorFunction
    );
}

function loadBeneficioPorMes() {
    makeRequest(
        `${urlReportes}costo-promedio-mes`,
        Method.GET,
        null,
        ContentType.JSON,
        CallType.PRIVATE,
        (data) => {
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const chartData = convertMapToChartData(data);
            const labels = chartData.labels.map(label => {
                const [month, year] = label.split('-');
                return `${monthNames[parseInt(month) - 1]}`;
            });
            new Chart(document.getElementById('beneficioPorMes'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Beneficio Total',
                        data: chartData.data,
                        backgroundColor: '#36A2EB'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        },
        errorFunction
    );
}

document.addEventListener('DOMContentLoaded', () => {
    loadRecetasTipoUsoBar();
    loadRecetasTipoUsoPie();
    loadRecetasTipoAlimentosBar();
    loadRecetasTipoAlimentosPie();
    loadBeneficioPorMes();
});