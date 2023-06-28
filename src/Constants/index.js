// import {encode_utf8} from "../Util/Util";

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
    //'Accept': 'application/vnd.certuit-' + API_VERSION + '+json',
    'Content-Type': 'application/json',
    'RFC': `${localStorage.getItem("RFC")}`
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
    'Content-Type': 'multipart/form-data',
    'RFC': `${localStorage.getItem("RFC")}`
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
    footerTotalVisibleRows: (visibleCount, totalCount) =>
        `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
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

//OBSOLETA DESDE JUNIO 26 2023
export const TICKET_ZABRA_TAMPLATE_OLD = (guia, paquete, index) => (
    `^XA

^CI28
^MUm
^FO5,3
^BQN,2,5
^FH^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
^FS^CI28^A0,4,4^FT30,49^FWB^FDGuía:^FS
^FS^CI28^A0,8,8^FT42,49^FWB^FH^FD${guia.m_nFolioGuia}^FS
^FS^CI28^AC,3,3^FT49,49^FWB^FDDestinatario:^FS
^FS^CI28^A0,4,4^FT54,49,0^FWB^FH^FD${guia.m_sNombreDestinatario}^FS
^FS^CI28^AC,3,3^FT59,49^FWB^FDCliente:^FS
^FS^CI28^A0,4,4^FT64,49,0^FWB^FD${guia.m_sCliente} ^FS
^FS^CI28^AC,3,3^FT69,49^FWB^FDOrigen:^FS
^FS^CI28^A0,5,5^FT74,50^FWB^FD ${guia.m_sCiudadOrigen}^FS
^FS^CI28^AC,3,3^FT79,49^FWB^FDDestino:^FS
^FS^CI28^A0,5,5^FT84,50^FWB^FD ${guia.m_sCiudadDestino}^FS
^FS^CI28^A0,4,4^FT90,49^FWB^FDPaquete ID:^FS
^FS^CI28^A0,5,5^FT90,31^FWB^FD ${paquete.m_nIdEmbarqueDetalle}^FS
^FS^CI28^A0,4,4^FT96,49^FWB^FDCantidad:^FS
^FS^CI28^A0,5,5^FT96,31^FWB^FD ${index + 1} ^FS
^FS^CI28^A0,4,4^FT96,23^FWB^FDde^FS
^FS^CI28^A0,5,5^FT96,17^FWB^FD ${paquete.ctd} ^FS
^FS^CI28^AC,1,1^FT100,49^FWB^FD ${paquete.m_sDescripcion} ^FS
^MUd
^XZ`)

export const TICKET_ZEBRA_TEMPLATE = (guia, paquete, index) => (
    `CT~~CD,~CC^~CT~
^XA
~TA000
~JSN
^LT0
^MNW
^MTT
^PON
^PMN
^LH0,0
^JMA
^PR3,3
~SD8
^JUS
^LRN
^CI27
^PA0,1,1,0
^XZ
^XA
^MMT
^PW815
^LL1295
^LS0
^FT274,79^A0N,39,51^FH\^CI28^FD${guia.m_nFolioGuia}^FS^CI27
^FO46,23^GFA,909,2752,32,:Z64:eJztVL9r20AUflJ8YG4wDki7cBZzBeVfOINMVwV0W/u/HC4UcYP/hsNDEc9wc0imZuzuPTiLUMDZG7B7p1qyY6hSyOoPczzp6Xvf++UDOOOMDyL6GJ0q2envvUNfjPCdDLwup6zmuuxQJwlkvIMfaRi9o9+FvkSlxh367tfZglGUO/0IO3U8Lv6hX+T5GKvZ46bCqkR7SFr62LTEinPoCTHlIhMidQcPMyLSNoJi44jhQiMyLNyhGVIsjrUhFBMeilDc/A0iWr4/zwuFRYyoqUFToDFYGDNv+J5wyIg35URAAGkQwE1KCDT85fJueXdLYSF9JRloxsCGUtC0tOanxJuAJQVey2+w2b1styVVa0nnMoYyZ3n1OFA5HPgrq2/rJ4QHkNlSbjiZZnv3xfLu/hlvqa2fzrTVBtcKqlAf558SV39o+cK1wuq39ZuXl922GJiZjI2OwYA1i8HMFK3+SqxS0iO2f5afQhh6nHDSJLC8f17+Lij40jXe1c98TSUc+LW+m0GY1vWHnn1s+7fZbTfbciB9aVTJoDRsLiuUsmzzX2VfLIHwzHP8LCBc2FXa6/v4SS9ux0zTgvmIys6f2U04mr/ntEK7M6GX2blnWZhau90fX+bjMo/lwMx9O3djTGwGdgNaPufAQdjp84YvXFW88UdqrDWTFLWPrNZ31ps/Q/0taTeWpN5heyFXauGG5Vdy/4ZW5uhC4NmE1wGyJpTNgx/8EVvMaiZevP64Wo+uriUyefAPh/v7ZwiT5HKYTIbu1QHUZlwbfXiIGf31WkC/f+TvQZDszWkSkN5XeAs/os2yfvs+8mfXV/KN/+jy48lFL/l8eRJAFXpvPayfcP10L08+aIvl3s8k4OTETenRQ2QTOvF7Q+jGqd4ZZ/wn/gCkowDl:E185
^FT218,161^A0N,35,35^FH\^CI28^FD${guia.m_sCiudadOrigen}^FS^CI27
^FO46,255^GB697,275,4,,2^FS
^FT61,161^A0N,35,43^FH\^CI28^FDORIGEN:^FS^CI27
^FT50,245^A0N,35,48^FH\^CI28^FDREMITENTE^FS^CI27
^FT61,303^A0N,31,30^FH\^CI28^FD${guia.m_sNOmbreRemitente}^FS^CI27
^FT61,359^A0N,35,48^FH\^CI28^FDTEL:^FS^CI27
^FT150,359^A0N,35,43^FH\^CI28^FD${guia.m_sTelefonoRemitente}^FS^CI27
^FT61,415^A0N,35,48^FH\^CI28^FDDIRECCIÓN:^FS^CI27
${guia.m_sDomicilioRemitente.length > 30 ?
        (
            guia.m_sDomicilioRemitente.length > 75 ? (
                `^FT291,415^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS^CI27
        ^FT65,459^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioRemitente.substring(25, 70)}^FS^CI27
        ^FT65,513^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioRemitente.substring(70)}^FS^CI27`
            ) : (
                `^FT291,415^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS^CI27
            ^FT65,459^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioRemitente.substring(25)}^FS^CI27`
            )
        ) : `^FT291,415^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioRemitente}^FS^CI27`}
^FT61,565^A0N,35,48^FH\\^CI28^FD${guia.m_sSucursalorigen}^FS^CI27
^FO50,645^GB697,287,4,,2^FS
^FT53,633^A0N,35,48^FH\^CI28^FDDESTINO:^FS^CI27
^FT65,691^A0N,31,33^FH\\^CI28^FD${guia.m_sNombreDestinatario}^FS^CI27
^FT65,747^A0N,35,48^FH\^CI28^FDTEL:^FS^CI27
^FT154,747^A0N,35,41^FH\^CI28^FD${guia.m_sTelefonoDestinatario}^FS^CI27
^FT65,804^A0N,35,48^FH\^CI28^FDDIRECCIÓN:^FS^CI27
^FT50,978^A0N,35,48^FH\\^CI28^FD${guia.m_sSucursalDestino}^FS^CI27
^FT100,1120^A0N,35,43^FH\^CI28^FD${index + 1} DE ${paquete.ctd}^FS^CI27
^FT500,1195^BQN,2,7
^FH\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
${guia.m_sDomicilioDestinatario.length > 30 ?
        (
            guia.m_sDomicilioDestinatario.length > 72 ? (
                `^FT291,804^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS^CI27
            ^FT65,856^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioDestinatario.substring(25,70)}^FS^CI27
            ^FT72,910^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioDestinatario.substring(70)}^FS^CI27`
            ) : (
                `^FT291,804^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS^CI27
            ^FT72,856^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioDestinatario.substring(25)}^FS^CI27`
            )
        ) : `^FT291,804^A0N,35,30^FH\^CI28^FD${guia.m_sDomicilioDestinatario}}^FS^CI27`
    }
^PQ1,0,1,Y
^XZ`)


export const TOOLBAR_OPTIONS = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
    inline: {inDropdown: true},
    list: {inDropdown: true},
    textAlign: {inDropdown: true},
    link: {inDropdown: true},
    history: {inDropdown: true},
};

