let gpsApp = null;

function capturarGpsApp() {
    const res = document.getElementById("appGps");

    if (!navigator.geolocation) {
        res.innerHTML = '<span style="color:#ef4444;">❌ GPS não suportado</span>';
        return;
    }

    res.innerHTML = '<span class="vazio">⏳ Obtendo localização...</span>';

    navigator.geolocation.getCurrentPosition(
        function (pos) {
            gpsApp = {
                lat: pos.coords.latitude.toFixed(6),
                lon: pos.coords.longitude.toFixed(6)
            };
            res.innerHTML =
                '<div class="linha" style="color:#10b981;"><strong>✅ Localização capturada</strong></div>' +
                '<div class="linha"><strong>Lat:</strong> ' + gpsApp.lat + '</div>' +
                '<div class="linha"><strong>Lon:</strong> ' + gpsApp.lon + '</div>';
        },
        function () {
            res.innerHTML = '<span style="color:#ef4444;">❌ Não foi possível obter GPS</span>';
        },
        { enableHighAccuracy: true, timeout: 12000 }
    );
}

function montarMensagem() {
    const nome = document.getElementById("appNome").value.trim() || "Cliente";
    const pedido = document.getElementById("appPedido").value.trim() || "Sem descrição";
    let msg = "Olá! Meu nome é " + nome + ".\nPedido: " + pedido;
    if (gpsApp) {
        msg += "\nLocalização: https://www.google.com/maps?q=" + gpsApp.lat + "," + gpsApp.lon;
    }
    return msg;
}

function enviarPedidoZap() {
    const numero = document.getElementById("appZap").value.replace(/\D/g, "");
    const res = document.getElementById("resultadoApp");

    if (!numero) {
        alert("Digite o WhatsApp de destino.");
        return;
    }

    const msg = montarMensagem();
    const url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(msg);

    res.innerHTML = "✅ <strong>Link gerado:</strong><br>" + url;

    window.open(url, "_blank");
}

function compartilharPedido() {
    const res = document.getElementById("resultadoApp");

    if (!navigator.share) {
        res.innerHTML = '<span style="color:#f59e0b;">⚠️ Compartilhamento não suportado</span>';
        return;
    }

    navigator.share({
        title: "Meu Pedido",
        text: montarMensagem()
    })
        .then(() => {
            res.innerHTML = '<span style="color:#10b981;">✅ Pedido compartilhado!</span>';
        })
        .catch(() => { });
}