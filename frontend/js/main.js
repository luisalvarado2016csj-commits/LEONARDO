document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos UI de Análisis ---
    const fileInput = document.getElementById('file-upload');
    const btnAnalizar = document.getElementById('btn-analizar');
    const dropZone = document.getElementById('drop-zone');
    const uploadPrompt = document.getElementById('upload-prompt');
    const imagePreview = document.getElementById('image-preview');
    const btnRemove = document.getElementById('btn-remove');
    
    const panelEspera = document.getElementById('panel-espera');
    const panelLoading = document.getElementById('panel-loading');
    const panelResultados = document.getElementById('panel-resultados');
    const alertaResultado = document.getElementById('alerta-resultado');
    const textoEstado = document.getElementById('texto-estado');
    const textoConfianza = document.getElementById('texto-confianza');
    const textoAccion = document.getElementById('texto-accion');

    // --- Elementos UI de Pestañas ---
    const tabAnalisis = document.getElementById('tab-analisis');
    const tabEstadisticas = document.getElementById('tab-estadisticas');
    const viewAnalisis = document.getElementById('view-analisis');
    const viewEstadisticas = document.getElementById('view-estadisticas');

    // --- Elementos UI de Estadísticas ---
    const statAprobados = document.getElementById('stat-aprobados');
    const statDefectos = document.getElementById('stat-defectos');
    const statTotal = document.getElementById('stat-total');
    const aiInsights = document.getElementById('ai-insights');

    // --- Variables Globales ---
    let imagenSeleccionada = null;
    let chartDistribucion = null;
    let estadisticas = {
        aprobados: 0,
        defectos: 0,
        total: 0
    };

    // --- Inicialización ---
    cargarEstadisticas();
    inicializarGrafico();

    // --- Lógica de Pestañas (Tabs) ---
    tabAnalisis.addEventListener('click', () => {
        // Activar tab Análisis
        tabAnalisis.classList.replace('bg-slate-800', 'bg-blue-600');
        tabAnalisis.classList.replace('text-slate-400', 'text-white');
        tabAnalisis.classList.replace('border-transparent', 'border-blue-400');
        tabAnalisis.classList.remove('hover:bg-slate-700', 'hover:text-white');
        
        // Desactivar tab Estadísticas
        tabEstadisticas.classList.replace('bg-blue-600', 'bg-slate-800');
        tabEstadisticas.classList.replace('text-white', 'text-slate-400');
        tabEstadisticas.classList.replace('border-blue-400', 'border-transparent');
        tabEstadisticas.classList.add('hover:bg-slate-700', 'hover:text-white');

        // Mostrar/Ocultar Vistas
        viewAnalisis.classList.remove('hidden');
        viewEstadisticas.classList.add('hidden');
    });

    tabEstadisticas.addEventListener('click', () => {
        // Activar tab Estadísticas
        tabEstadisticas.classList.replace('bg-slate-800', 'bg-blue-600');
        tabEstadisticas.classList.replace('text-slate-400', 'text-white');
        tabEstadisticas.classList.replace('border-transparent', 'border-blue-400');
        tabEstadisticas.classList.remove('hover:bg-slate-700', 'hover:text-white');
        
        // Desactivar tab Análisis
        tabAnalisis.classList.replace('bg-blue-600', 'bg-slate-800');
        tabAnalisis.classList.replace('text-white', 'text-slate-400');
        tabAnalisis.classList.replace('border-blue-400', 'border-transparent');
        tabAnalisis.classList.add('hover:bg-slate-700', 'hover:text-white');

        // Mostrar/Ocultar Vistas
        viewAnalisis.classList.add('hidden');
        viewEstadisticas.classList.remove('hidden');
    });

    // --- Lógica de Ingesta Visual ---
    fileInput.addEventListener('change', function(event) {
        if(event.target.files && event.target.files[0]) {
            imagenSeleccionada = event.target.files[0];
            
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
                uploadPrompt.classList.add('hidden');
                btnRemove.classList.remove('hidden');
            }
            reader.readAsDataURL(imagenSeleccionada);
            
            btnAnalizar.disabled = false;
            
            panelEspera.classList.remove('hidden');
            panelResultados.classList.add('hidden');
        }
    });

    btnRemove.addEventListener('click', () => {
        imagenSeleccionada = null;
        fileInput.value = '';
        imagePreview.src = '';
        imagePreview.classList.add('hidden');
        uploadPrompt.classList.remove('hidden');
        btnRemove.classList.add('hidden');
        btnAnalizar.disabled = true;
        
        panelEspera.classList.remove('hidden');
        panelResultados.classList.add('hidden');
    });

    btnAnalizar.addEventListener('click', async () => {
        if(!imagenSeleccionada) return;

        btnAnalizar.disabled = true;
        btnAnalizar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Ejecutando Red Neuronal...';
        
        panelEspera.classList.add('hidden');
        panelResultados.classList.add('hidden');
        panelLoading.classList.remove('hidden');

        const formData = new FormData();
        formData.append('imagen', imagenSeleccionada);

        try {
            // Conectar con el backend en la nube (Hugging Face)
            const response = await fetch('https://arturitocracksito-leonardo-backend.hf.space/api/analizar', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.status === 'error') {
                alert("Error en el servidor: " + data.message);
                panelLoading.classList.add('hidden');
                panelEspera.classList.remove('hidden');
                return;
            }

            panelLoading.classList.add('hidden');
            panelResultados.classList.remove('hidden');
            
            if(data.prediccion === 'Aprobado') {
                alertaResultado.className = 'rounded-lg p-5 mb-4 shadow-md bg-emerald-500 text-white';
                textoEstado.innerHTML = '<i class="fa-solid fa-check-circle"></i> PIEZA ÓPTIMA';
                textoAccion.innerHTML = "<span class='text-emerald-400'>[FLUJO NORMAL]</span> La pieza cumple con los estándares milimétricos. Puede continuar su trayecto hacia el área de embalaje sin restricciones.";
                
                // Actualizar Stats
                estadisticas.aprobados++;
            } else {
                alertaResultado.className = 'rounded-lg p-5 mb-4 shadow-md bg-rose-600 text-white';
                textoEstado.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> DEFECTO CRÍTICO';
                textoAccion.innerHTML = "<span class='text-rose-500 font-bold'>[ACCIÓN URGENTE REQUERIDA]</span> <br> 1. Detener faja transportadora en sector B. <br> 2. El brazo robótico debe retirar la pieza inmediatamente. <br> 3. <strong>Bajo ninguna circunstancia esta unidad puede salir a la venta.</strong>";
                
                // Actualizar Stats
                estadisticas.defectos++;
            }

            textoConfianza.textContent = `${data.confianza}%`;
            
            // Incrementar total y guardar
            estadisticas.total++;
            guardarEstadisticas();
            actualizarUIEstadisticas();

        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el motor de inferencia.");
            panelLoading.classList.add('hidden');
            panelEspera.classList.remove('hidden');
        } finally {
            btnAnalizar.disabled = false;
            btnAnalizar.innerHTML = '<i class="fa-solid fa-bolt"></i> Iniciar Análisis de Tensores';
        }
    });

    // --- Funciones de Estadísticas ---
    function cargarEstadisticas() {
        const statsGuardadas = localStorage.getItem('leoIA_stats');
        if (statsGuardadas) {
            estadisticas = JSON.parse(statsGuardadas);
        }
        actualizarUIEstadisticas();
    }

    function guardarEstadisticas() {
        localStorage.setItem('leoIA_stats', JSON.stringify(estadisticas));
    }

    function actualizarUIEstadisticas() {
        statAprobados.textContent = estadisticas.aprobados;
        statDefectos.textContent = estadisticas.defectos;
        statTotal.textContent = estadisticas.total;

        if (chartDistribucion) {
            chartDistribucion.data.datasets[0].data = [estadisticas.aprobados, estadisticas.defectos];
            chartDistribucion.update();
        }

        // --- Generación de Insights Dinámicos ---
        if (estadisticas.total > 0) {
            let mensaje = "";
            let icono = "";
            const porcentajeAprobado = (estadisticas.aprobados / estadisticas.total) * 100;

            if (estadisticas.total < 5) {
                icono = '<i class="fa-solid fa-microscope text-5xl text-blue-400 mb-4 animate-pulse"></i>';
                mensaje = "Comenzando análisis del lote. Las piezas procesadas hasta ahora muestran una tendencia inicial. Necesitamos procesar más para una lectura precisa.";
            } else if (porcentajeAprobado >= 90) {
                icono = '<i class="fa-solid fa-ranking-star text-5xl text-emerald-400 mb-4 animate-bounce"></i>';
                mensaje = `¡Excelente rendimiento! La línea de producción opera con un <strong>${porcentajeAprobado.toFixed(1)}%</strong> de éxito. La calibración de la máquina inyectora parece óptima.`;
            } else if (porcentajeAprobado >= 70) {
                icono = '<i class="fa-solid fa-triangle-exclamation text-5xl text-yellow-500 mb-4 animate-pulse"></i>';
                mensaje = `Rendimiento aceptable (<strong>${porcentajeAprobado.toFixed(1)}%</strong>). Sin embargo, se sugiere revisar los parámetros de temperatura de la matriz debido al volumen de defectos.`;
            } else {
                icono = '<i class="fa-solid fa-siren-on text-5xl text-rose-500 mb-4 animate-ping"></i>';
                mensaje = `<strong>ALERTA CRÍTICA:</strong> El <strong>${(100 - porcentajeAprobado).toFixed(1)}%</strong> de las piezas presentan anomalías severas. Se recomienda detener la producción y recalibrar el brazo robótico de inmediato.`;
            }

            aiInsights.innerHTML = `
                ${icono}
                <p class="text-slate-300 text-sm leading-relaxed">${mensaje}</p>
            `;
        }
    }

    function inicializarGrafico() {
        const ctx = document.getElementById('chart-distribucion').getContext('2d');
        
        Chart.defaults.color = '#94a3b8'; // text-slate-400
        Chart.defaults.font.family = "'Inter', sans-serif";

        chartDistribucion = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Piezas Óptimas', 'Defectos Detectados'],
                datasets: [{
                    data: [estadisticas.aprobados, estadisticas.defectos],
                    backgroundColor: [
                        '#10b981', // emerald-500
                        '#e11d48'  // rose-600
                    ],
                    borderColor: '#1e293b', // slate-800
                    borderWidth: 4,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 14 },
                        bodyFont: { size: 14 },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                cutout: '70%'
            }
        });
    }

});