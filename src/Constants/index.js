import {encode_utf8} from "../Util/Util";

export const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

export const ACCESS_TOKEN = 'accessToken';
export const USER_ROLES = 'roles';
export const DEVICE_ID = 'deviceId';
export const USER_ID_SESSION = 'userId';
export const COMPLETE_NAME = 'completeName';
export const API_VERSION = 'v1.0.0';
export const APP_TITLE = "Sistemas Sierra";
export const OAUTH2_REDIRECT_URI = 'http://192.168.1.185:8080/sierra/oauth2/redirect';
export const API_HEADERS = {
    'Accept': 'application/vnd.certuit-' + API_VERSION + '+json',
    'Content-Type': 'application/json',
};

export const API_AUTENTICATION_HEADERS = {
    'Accept': 'application/vnd.certuit-' + API_VERSION + '+json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN),
};

export const API_BASIC_HEADERS = {
    'Accept': 'application/vnd.certuit-' + API_VERSION + '+json',
    'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN),
};
export const API_MULTIPART_HEADERS = {
    'Accept': 'application/vnd.certuit-' + API_VERSION + '+json',
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN),
};

export function TABLE_OPTIONS(filename, searchOpen = true, onRowClick) {
    return ({
        filter: true,
        selectableRows: "none",
        filterType: "multiselect",
        responsive: "scrollMaxHeight",
        viewColumns: false,
        download: false,
        searchOpen: searchOpen,
        selectableRowsOnClick: false,
        onCellClick: onRowClick,
        print: false,
        expandableRowsOnClick: true,
        downloadOptions: {filename: filename + '.csv', separator: ','},
        // customToolbar: () => {
        //   return <CustomToolbar onClick={addRowAction} />;
        // },
        textLabels: {
            body: {
                noMatch: "No se encontraron registros",
                toolTip: "Filtar"
            },
            pagination: {
                next: "Siguiente página",
                previous: "Página anterior",
                rowsPerPage: "Registros por página:",
                displayRows: "de",
            },
            toolbar: {
                search: "Buscar",
                downloadCsv: "Descargar en CSV",
                print: "Imprimir",
                viewColumns: "Columnas visibles",
                filterTable: "Filtar tabla",
            },
            filter: {
                all: "Todos",
                title: "Filtros",
                reset: "Limpiar",
            },
            viewColumns: {
                title: "Mostrar columnas",
                titleAria: "Mostrar/Ocultar columnas de la tabla",
            },
            selectedRows: {
                text: "registros seleccionados",
                delete: "Borrar",
                deleteAria: "Borrar registros seleccionados",
            },
        }
    })
};

export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL = API_BASE_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = API_BASE_URL + '/oauth2/authorize/github?redirect_uri=' + OAUTH2_REDIRECT_URI;

export const dataGridLocaleText = {
    // Root
    rootGridLabel: 'grid',
    noRowsLabel: 'No se encontró ningún registro',
    errorOverlayDefaultLabel: 'A ocurrido un error al cargar los datos.',

    // Filters toolbar button text
    toolbarFilters: 'Filtros',
    toolbarFiltersLabel: 'Mostrar filtro',
    toolbarFiltersTooltipHide: 'Ocultar filtro',
    toolbarFiltersTooltipShow: 'Mostrar filtro',
    toolbarFiltersTooltipActive: (count) =>
        count !== 1 ? `${count} active filters` : `${count} active filter`,

    // Export selector toolbar button text
    toolbarExport: 'Exportar',
    toolbarExportLabel: 'Exportar',
    toolbarExportCSV: 'Descargar como CSV',

    // Columns panel text
    columnsPanelTextFieldLabel: 'Buscar columna',
    columnsPanelTextFieldPlaceholder: 'Título de la Columna',
    columnsPanelDragIconLabel: 'Reordenar columna',
    columnsPanelShowAllButton: 'Mostrar todo',
    columnsPanelHideAllButton: 'Ocultar todo',

    // Filter panel text
    filterPanelAddFilter: 'Agregar filtro',
    filterPanelDeleteIconLabel: 'Eliminar',
    filterPanelOperators: 'Operador',
    filterPanelOperatorAnd: 'Y',
    filterPanelOperatorOr: 'O',
    filterPanelColumns: 'Columna',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Valor de filtrado',

    // Filter operators text
    filterOperatorContains: 'contiene',
    filterOperatorEquals: 'igual a',
    filterOperatorStartsWith: 'empieza con',
    filterOperatorEndsWith: 'termina con',
    filterOperatorIs: 'igual a',
    filterOperatorNot: 'diferente a',
    filterOperatorAfter: 'después de',
    filterOperatorOnOrAfter: 'está en o después',
    filterOperatorBefore: 'es antes',
    filterOperatorOnOrBefore: 'está en o antes',

    // Column menu text
    columnMenuLabel: 'Menú',
    columnMenuShowColumns: 'Mostrar columna',
    columnMenuFilter: 'Filtro',
    columnMenuHideColumn: 'Ocultar columna',
    columnMenuUnsort: 'Por defecto',
    columnMenuSortAsc: 'Ascendiente',
    columnMenuSortDesc: 'Descendiente',

    // Rows selected footer text
    footerRowSelected: (count) =>
        count !== 1
            ? `${count.toLocaleString()} renglones seleccionados`
            : `${count.toLocaleString()} renglón seleccionado`,

    // Total rows footer text
    footerTotalRows: 'Renglones totales:',

    backIconButtonText: 'Página anterior',
    labelRowsPerPage: 'Filas por página:',
    labelDisplayedRows: ({from, to, count}) =>
        `${from}-${to} de ${count !== -1 ? count : `more than ${to}`}`,
    nextIconButtonText: 'Siguiente página',
}

export const TICKET_ZABRA_TAMPLATE = (guia, paquete, index) => (
    /*`^XA
    ^CI28
    ^MMT
    ^PW1200
    ^LL1800
    ^LS0
    ^FT25,50^AAN,32,14^FH\\^FDFecha:^FS
    ^FT160,50^AAN,32,14^FH\\^FD${guia.m_dFecha}^FS
    ^FT25,120^AAN,32,14^FH\\^FD#Guia:^FS
    ^FT160,135^A0N,55,55^FH\\^FD${guia.m_nFolioGuia}^FS
    ^FT25,202^AAN,28,16^FH\\^FDServicio:^FS
    ^FT200,208^A0N,45,45^FH\\^FD${guia.m_sTipoServicio}^FS
    ^FO560,15
    ^BQN,2,10
    ^FDQA,${guia.m_nIdGuia}^FS
    ^FO40,260^GB1115,0,3^FS
    ^FT25,310^AAN,28,16^FH\\^FDDestinatario^FS
    ^FT480,310^AAN,28,16^FH\\^FDRemitente^FS
    ^FT25,350^A0N,30,30^FH\\^FD${guia.m_bEntregarMismoDomicilio ? guia.m_sDomicilioDestinatario : guia.m_sDomicilioEntrega}^FS
    ^FT25,390^A0N,30,30^FH\\^FD${guia.m_bEntregarMismoDomicilio ? guia.m_sColonia : guia.m_sColonia} ^FS
    ^FT25,430^A0N,30,30^FH\\^FDC.P. ${guia.m_bEntregarMismoDomicilio ? guia.m_nIdCodigoPostalDestinatario : guia.m_nIdCodigoPostalDestinatario}^FS
    ^FT25,470^A0N,30,30^FH\\^FD${guia.m_bEntregarMismoDomicilio ? guia.m_sCiudadDestinatario : guia.m_sCiudadDestino}, ${guia.m_bEntregarMismoDomicilio ? guia.m_sEstadoDestinatario : guia.m_sEstadoEntregaGuia}, ${guia.m_bEntregarMismoDomicilio ? guia.m_sPaisDestinatario : guia.m_sPaisEntregaGuia}^FS
    ^FT480,350^A0N,30,30^FH\\^FD${guia.m_sDomicilioRemitente}^FS
    ^FT480,390^A0N,30,30^FH\\^FD${guia.m_sColonia} ^FS
    ^FT480,430^A0N,30,30^FH\\^FDC.P. ${guia.m_sCodigoPostalEntrega}^FS
    ^FT480,470^A0N,30,30^FH\\^FD${guia.m_sCiudadOrigen}, ${guia.m_sEstadoRemitente}, ${guia.m_sPaisRemitente}^FS
    ^FO40,500^GB1115,0,3^FS
    ^FT25,540^AAN,28,16^FH\\^FD${guia.m_sNombreDestinatario}^FS
    ^FT25,580^AAN,28,16^FH\\^FD${guia.m_sRFCDestinatario}^FS
    ^FT25,620^AAN,28,16^FH\\^FD${guia.m_sDomicilioDestinatario}^FS
    ^FT25,660^AAN,28,16^FH\\^FD${guia.m_sEstadoDestinatario}^FS
    ^FT25,700^AAN,28,16^FH\\^FD${guia.m_sPaisRemitente}^FS
    ^FO32,730^GB1115,0,3^FS
    ^FT25,780^AAN,28,16^FH\\^FDOrigen^FS
    ^FT25,820^A0N,30,30^FH\\^FD${guia.m_sCiudadOrigen}^FS
    ^FT480,780^AAN,28,16^FH\\^FDDestino^FS
    ^FT480,820^A0N,30,30^FH\\^FD${guia.m_sCiudadDestino}^FS
    ^FO21,850^GB1115,0,3^FS
    ^FT21,890^AAN,28,16^FH\\^FD#Paquetes:^FS
   ^FT210,910^A0N,67,67^FH\\^FD${index + 1}^FS
    ^FT250,910^A0N,40,40^FH\\^FDde^FS
    ^FT310,910^A0N,67,67^FH\\^FD${paquete.ctd}^FS
    ^FT440,910^AAN,28,16^FH\\^FDPeso:^FS
    ^FT550,910^A0N,67,67^FH\\^FD${paquete.m_xPeso} kg^FS
    ^FT25,980^AAN,28,16^FH\\^FDAltura(cm):^FS
    ^FT250,980^A0N,67,67^FH\\^FD${paquete.m_xAlto}^FS
    ^FT440,980^AAN,28,16^FH\\^FDLargo(cm):^FS
    ^FT630,980^A0N,67,67^FH\\^FD${paquete.m_xLargo}^FS
    ^FT25,1050^AAN,28,16^FH\\^FDAncho(cm):^FS
    ^FT250,1050^A0N,67,67^FH\\^FD${paquete.m_xAncho}^FS
    ^FO21,1080^GB1115,0,3^FS
    ^FO650,1077
    ^BQN,2,3
    ^FDQA,http://190.9.53.4:8081/app/applications/${guia.m_nIdGuia}/tracking^FS
    ^PQ1,0,1,Y^XZ`*/
`^XA
^MUm
^LL150,^PW100^LH0,0
^FO3,7
^BQN,2,8
^FDQA,${guia.m_nIdGuia}^FS
^FS^CI28^A0,4,4^FT27,49^FWB^FDGuía:^FS
^FS^CI28^A0,8,8^FT38,49^FWB^FH^FD${guia.m_nFolioGuia}^FS
^FS^CI28^AC,3,3^FT44,49^FWB^FDRemitente:^FS
^FS^CI28^A0,4,4^FT49,49,0^FWB^FH^FD${guia.m_sNombreRemitente}^FS
^FS^CI28^A0,4,4^FT53,49,0^FWB^FDGRADUACION SA DE CV^FS
^FS^CI28^AC,3,3^FT59,49^FWB^FDCliente:^FS
^FS^CI28^A0,4,4^FT64,49,0^FWB^FD${guia.m_sCliente} ^FS
^FS^CI28^A0,4,4^FT68,49,0^FWB^FDGRADUACION SA DE CV^FS
^FS^CI28^AC,3,3^FT74,49^FWB^FDOrigen:^FS
^FS^CI28^A0,5,5^FT79,50^FWB^FD ${guia.m_sCiudadOrigen}^FS
^FS^CI28^AC,3,3^FT84,49^FWB^FDDestino:^FS
^FS^CI28^A0,5,5^FT89,50^FWB^FD ${guia.m_sCiudadDestino}^FS
^FS^CI28^A0,4,4^FT95,49^FWB^FDPaquetes:^FS
^FS^CI28^A0,5,5^FT95,31^FWB^FD 1 ^FS
^FS^CI28^A0,4,4^FT95,23^FWB^FDde^FS
^FS^CI28^A0,5,5^FT95,17^FWB^FD 1 ^FS
^MUd
^XZ`)


/*    (`^XA
^CI28
^MMT
^PW1200
^LL1800
^LS0
^FO40,289^GB1115,0,3^FS
^FT25,92^AAN,36,20^FH\\^FD#Guia:^FS
^FT178,109^A0N,67,67^FH\\^FD${guia.m_nFolioGuia}^FS
^FT25,340^AAN,36,20^FH\\^FDDestinatario^FS
^FT674,340^AAN,36,20^FH\\^FDRemitente^FS
^FT25,412^A0N,50,50^FH\\^FD${guia.m_bEntregarMismoDomicilio ? guia.m_sDomicilioDestinatario : guia.m_sDomicilioEntrega}^FS
^FT25,475^A0N,50,50^FH\\^FD${guia.m_bEntregarMismoDomicilio ? guia.m_sColonia : guia.m_sColonia}^FS
^FT25,538^A0N,50,50^FH\\^FDC.P. ${guia.m_bEntregarMismoDomicilio ? guia.m_nIdCodigoPostalDestinatario : guia.m_nIdCodigoPostalDestinatario}^FS
^FT25,601^A0N,50,50^FH\\^FD${guia.m_bEntregarMismoDomicilio ? guia.m_sCiudadDestinatario : guia.m_sCiudadDestino}, ${guia.m_bEntregarMismoDomicilio ? guia.m_sEstadoDestinatario : guia.m_sEstadoEntregaGuia}, ${guia.m_bEntregarMismoDomicilio ? guia.m_sPaisDestinatario : guia.m_sPaisEntregaGuia}^FS
^FT674,412^A0N,50,50^FH\\^FD${guia.m_sDomicilioRemitente}^FS
^FT674,475^A0N,50,50^FH\\^FD${guia.m_sColonia}^FS
^FT674,538^A0N,50,50^FH\\^FDC.P. ${guia.m_sCodigoPostalEntrega}^FS
^FT674,601^A0N,50,50^FH\\^FD${guia.m_sCiudadOrigen}, ${guia.m_sEstadoRemitente}, ${guia.m_sPaisRemitente}^FS
^FO40,638^GB1115,0,3^FS
^FO32,899^GB1115,0,3^FS
^FT900,295
^BQN,2,10
^FDQA,${guia.m_nIdGuia}^FS
^FT25,694^AAN,36,20^FH\\^FD${guia.m_sNombreDestinatario}^FS
^FT25,730^AAN,36,20^FH\\^FD${guia.m_sRFCDestinatario}^FS
^FT25,766^AAN,36,20^FH\\^FD${guia.m_sDomicilioDestinatario}^FS
^FT25,802^AAN,36,20^FH\\^FD${guia.m_sEstadoDestinatario}^FS
^FT25,838^AAN,36,20^FH\\^FD${guia.m_sPaisRemitente}^FS
^FT25,957^AAN,36,20^FB145,1,0,R^FH\\^FDOrigen^FS
^FT25,1029^A0N,50,50^FH\\^FD${guia.m_sCiudadOrigen} ^FS
^FT674,1029^A0N,50,50^FH\\^FD${guia.m_sCiudadDestino}^FS
^FT674,957^AAN,36,20^FB169,1,0,R^FH\\^FDDestino^FS
^FO21,1086^GB1115,0,3^FS
^FT21,1165^AAN,36,20^FH\\^FD#Paquetes:^FS
^FT265,1182^A0N,67,67^FH\\^FD${paquete.ctd}^FS
^FT25,202^AAN,36,20^FH\\^FDServicio:^FS
^FT244,208^A0N,45,45^FH\\^FD${guia.m_sTipoServicio}^FS
^FT562,1165^AAN,36,20^FH\\^FDPeso:^FS
^FT25,1259^AAN,36,20^FH\\^FDAltura(mts):^FS
^FT562,1259^AAN,36,20^FH\\^FDLargo(mts):^FS
^FT25,1345^AAN,36,20^FH\\^FDAncho(mts):^FS
^FT701,1182^A0N,67,67^FH\\^FD${paquete.m_xPeso} kg^FS
^FT320,1276^A0N,67,67^FH\\^FD${paquete.m_xAlto}^FS
^FT838,1276^A0N,67,67^FH\\^FD${paquete.m_xAncho}^FS
^FT320,1367^A0N,67,67^FH\\^FD${paquete.m_xLargo}^FS
^FO21,1396^GB1115,0,3^FS
^PQ1,0,1,Y^XZ`)*/

