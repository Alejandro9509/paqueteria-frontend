jQuery(document).ready(function($) {
    "use strict";

        var modal = {};
        $(document).on("click", "a[data-bb]", function (e) {
            var type = $(this).data("bb");
    
            if (typeof modal[type] === 'function') {
                modal[type]();
            }
        });

        modal.departamento_modal = function () {
            bootbox.dialog({
                title: "Departamento",
                message: '<div class="row">' +
                '<div class="col-md-12">' +
                    '<form class="form-horizontal">' +
                        '<div class="form-group">' +
                            '<label class="col-md-4 control-label" for="codigo">Código</label>' +
                            '<div class="col-md-4">' +
                                '<input class="form-control" id="codigo" name="codigo" type="number" placeholder="Código" class="form-control input-md">' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-md-4 control-label" for="descripcion">Descripción</label>' +
                            '<div class="col-md-4">' +
                                '<input class="form-control" id="descripcion" name="descripcion" type="text" placeholder="Descripción" class="form-control input-md">' +
                            '</div>' +
                        '</div> ' +
                    '</form>' +
                '</div>' +
            '</div>',
                buttons: {
                    success: {
                        label: "Guardar",
                        className: "btn-success",
                        callback: function () {
                            var codigo = $('#codigo').val();
                            var descripcion = $("#descripcion").val()
                            var xmlHttp = new XMLHttpRequest();
	                        var params = {
		                        "Codigo":codigo,
		                        "Descripcion":descripcion,
		                        "CreadoPor":1,
		                        "m_nModificadoPor":1
	                        }
		                    xmlHttp.open('POST', "http://localhost/Departamento/Agregar", true);
		                    xmlHttp.setRequestHeader('Content-type', 'application/json');
		                    xmlHttp.send(JSON.stringify(params));
		                    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
			                if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				                alert(xmlHttp.responseText);
				                location.reload();
			                }
		}
                        }
                    },
                    cancel: {
                        label: "Cancelar",
                        className: "btn-danger",
                        callback: function () {

                        }
                    }
                }
            });
        }

});

