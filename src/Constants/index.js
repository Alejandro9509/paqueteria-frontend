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

export const TICKET_ZEBRA_TEMPLATE = (guia, paquete, index) => (
    `CT~~CD,~CC^~CT~
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
^XA
^MMT
^CI28
^PW799
^LL1199
^LS0
^FO32,672^GFA,26496,26496,00092,:Z64:
eJzt3TFqwzAUxnEJDRp9g/giob5WhtDqaDqKjpAxQ6ibRpbjUBKKeR/B8H+D0SB+iGdJ4yfnqCc12taSjsZ2WdiDsX3RtWTZlDAm07/nxzyPu8vzeatqON2HxdiO98V+JWPbf/8dmdW82nA2t/s8DeLp1bRV1ZU2yC9mravQltsnc9u3Ng/mtHNtE34K7GZan8rfmnrh7bfg/A+9/Ra87r1qhyKwY652FtgTGiV2qXYS2L7ancSuG6QX0M6d5fZOYh9u3w+Jfbx99xJ7L7ePErt2+iCxd3JbcX23U6O4vq83CTb2m+2otBM2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY29nvsTmk7bOz/2spsrK3mhSkz1LaaK6fM2lNmBG41N1GZJRkldql2FthTdqcyc1SZlarMeFVm0yozdaVZwMoMY2X2sjIzWpl1rczoVmaLKzPRpVnuygx6ZXa+G03x8PAQwmD8nMCyx8o3FpRvQ9h2xf4oUhRlVT8URfg2:360F
^FO32,224^GFA,35328,35328,00092,:Z64:
eJzs3T2OgkAYBuAhFJTeYL3JeqUtLUzkaByFI1haGFkj4E82sTDfF0P2eZuZYvIIM6CdbykiIiIiIqshNIdHex9rnx/oOpYehi5tS542ZXOMPb716T5/vIeI1MN9en6x7q3su3nWBG/JZVP6v7Oo3K9200bb1e0w99F0KbcTPL1a9V4201iFH+XlCNtxrA8vl72VVTeOTR9vz+b8GZGZ92LVxtvVZK/j6VKm5+M7w97l27sMe7rgbYb9NQ4Jr+X8gFQJr+X8YKfafYbdXO06x+6udpdh1+l2k2P3V7vNsKt0O+Pre35rVhl0KWz2p+2fRHvLZrPZbDabzWaz2Ww2m81ms9lsNpvNZrPZbDabzWaz2Ww2m81ms9lsNpvNZrPZbDabzWaz2Ww2m81ms9lsNpvNZrPZbDabzWaz2Ww2m81ms/+9fUy0l/o/8exP2G0GPXZaLLXnI7P7ZKl9MJkdOZndPkvtO8rsgBp/2aIzdVdldm4ttYcss5sts1Muswuv6ePt2czsHszsTHzqevwFAAD//6MSgt31SNM7Kml5t6b8A2qbjbgTlJZ3mdLyDlZa3h1L0ztv+f9T1XB75Lt6aXnHMC3vRqbpnc7UDZUH1Iy8UTAKRsEoGAVYAQAuhW5C:F948
^FO480,1056^GFA,04608,04608,00036,:Z64:
${guia.m_sLogoEtiqueta}
^FT649,1037^A0I,39,48^FH\\^FD${guia.m_nFolioGuia}^FS
^FT581,1002^A0I,35,33^FH\\^FD${guia.m_sSucursalorigen}^FS
^FT745,1002^A0I,35,43^FH\\^FDORIGEN:^FS
^FT749,960^A0I,35,45^FH\\^FDREMITENTE^FS
^FT738,902^A0I,31,28^FH\\^FD${guia.m_sNOmbreRemitente}^FS
^FT738,845^A0I,35,45^FH\\^FDTEL:^FS
^FT649,845^A0I,35,40^FH\\^FD${guia.m_sTelefonoRemitente}^FS
^FT738,789^A0I,35,45^FH\\^FDDIRECCIÓN:^FS
${guia.m_sDomicilioRemitente.length > 30 ?
        (
            guia.m_sDomicilioRemitente.length > 75 ? (
                `^FT496,789^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                ^FT734,745^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(25, 70)}^FS
                ^FT734,691^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(70)}^FS`
            ) : (
                `^FT496,789^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                ^FT734,745^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(25)}^FS`
            )
        ) : `^FT496,789^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente}^FS`}
^FT738,639^A0I,35,45^FH\\^FD${guia.m_sCiudadOrigen}^FS
^FT746,605^A0I,35,45^FH\\^FDDESTINO:^FS
^FT734,547^A0I,31,31^FH\\^FD${guia.m_sNombreDestinatario}^FS
^FT734,491^A0I,35,45^FH\\^FDTEL:^FS
^FT645,491^A0I,35,38^FH\\^FD${guia.m_sTelefonoDestinatario}^FS
^FT734,434^A0I,35,45^FH\\^FDDIRECCIÓN:^FS
^FT749,207^A0I,35,45^FH\\^FD${guia.m_sCiudadDestino}^FS
^FT279,45^A0I,33,19^FH\\^FD${index + 1} DE ${paquete.ctd}^FS
^FT39,1197^BQN,2,6
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
${guia.m_sDomicilioDestinatario.length > 30 ?
        (
            guia.m_sDomicilioDestinatario.length > 75 ? (
                `^FT496,434^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT738,384^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(25, 70)}^FS
                 ^FT738,328^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(70)}^FS`
            ) : (
                `^FT496,434^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT738,384^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(25, 70)}^FS`
            )
        ) : `^FT496,434^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario}^FS`}
^FT411,147^A0I,28,40^FH\\^FDTIPO DE REPARTO^FS
^FT404,96^A0I,45,38^FH\\^FD${guia.tipoEntrega}^FS
^FT738,276^A0I,35,28^FH\\^FDZO.:${guia.zonaEntrega}^FS
^FT497,206^BQN,2,8
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
^FT450,47^A0I,28,40^FH\\^FDPARTIDA:^FS
^FT553,605^A0I,35,33^FH\\^FD${guia.m_sSucursalDestino}^FS
^PQ1,0,1,Y^XZ
`)


export const TOOLBAR_OPTIONS = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
    inline: {inDropdown: true},
    list: {inDropdown: true},
    textAlign: {inDropdown: true},
    link: {inDropdown: true},
    history: {inDropdown: true},
};

