document.addEventListener('DOMContentLoaded', () => {
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

    let imagenSeleccionada = null;

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
            const response = await fetch('http://127.0.0.1:5000/api/analizar', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            panelLoading.classList.add('hidden');
            panelResultados.classList.remove('hidden');
            
            if(data.prediccion === 'Aprobado') {
                alertaResultado.className = 'rounded-lg p-5 mb-4 shadow-md bg-emerald-500 text-white';
                textoEstado.innerHTML = '<i class="fa-solid fa-check-circle"></i> PIEZA ÓPTIMA';
                textoAccion.innerHTML = "<span class='text-emerald-400'>[FLUJO NORMAL]</span> La pieza cumple con los estándares milimétricos. Puede continuar su trayecto hacia el área de embalaje sin restricciones.";
            } else {
                alertaResultado.className = 'rounded-lg p-5 mb-4 shadow-md bg-rose-600 text-white';
                textoEstado.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> DEFECTO CRÍTICO';
                textoAccion.innerHTML = "<span class='text-rose-500 font-bold'>[ACCIÓN URGENTE REQUERIDA]</span> <br> 1. Detener faja transportadora en sector B. <br> 2. El brazo robótico debe retirar la pieza inmediatamente. <br> 3. <strong>Bajo ninguna circunstancia esta unidad puede salir a la venta.</strong>";
            }

            textoConfianza.textContent = `${data.confianza}%`;

        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el motor de inferencia DEVIOZ.");
            panelLoading.classList.add('hidden');
            panelEspera.classList.remove('hidden');
        } finally {
            btnAnalizar.disabled = false;
            btnAnalizar.innerHTML = '<i class="fa-solid fa-bolt"></i> Iniciar Análisis de Tensores';
        }
    });
});