import {confirmAlert} from "react-confirm-alert";
import Noty from "noty";

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
            encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
    };
    reader.onerror = error => reject(error);
});
export function confirmarEtiquetasAdicionalesDialog() {

    return new Promise(function (resolve, reject) {
        confirmAlert({
            title: 'Confirmación',
            message: '¿Desea imprimir etiquetas adicionales?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        resolve(true)
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        reject(false)
                    }
                }
            ]
        })
    })
}

export function showError(mensaje) {
    new Noty({
        type: "warning",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000"
    }).show()
}