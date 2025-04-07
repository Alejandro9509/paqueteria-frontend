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
    'RFC': `${localStorage.getItem("RFC")}`,
    'Content-Encoding': 'gzip',
    'Authorization': 'Bearer token',
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

export const TICKET_ZEBRA_TEMPLATE_deprecated = (guia, paquete, index) => (
    `CT~~CD,~CC^~CT~
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
^XA
^MMT
^CI28
^PW799
^LL1199
^LS0
^FO32,640^GFA,29440,29440,00092,:Z64:
eJzt3TFqwzAYxXEJDRp9g/giob5WhtDqaDqKjpAxQ6ibRpbjUBqK+V6D4f8Go8H8MJ9lj0/OEUIIIf+e0TZLOhrbZWEPxvZFN5LlUMKYTN+eH/O87i6/37cqw+m+LMZ2vD/sRzK2/efPlVnmpw1nc7vP0yKent22Kl1pi/zkrnUJ7XH7ZG77NubBnHaubcJ3gd1M66/yO9MsvP0WnN+ht9+C171X7VAEdszVzgJ7QqPELtVOAttXu5PYdYP0Atq5s9zeSezD7fomsY+3615i7+X2UWLXSR8k9k5uK37f7atR/L6vfxJs7BfbUWknbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbOzX2J3SdtjYf7WV3Vhb7QtTdqhttVdO2bWn7Ajcam+isksySuxS7Sywp+5OZeeositV2fGq7KZVdupKu4CVHcbK7mVlZ7Sy61rZ0a3sFld2oku73JUd9MrufDea4uHhIITB+DiB5YyVZywoz4awnYr9p0gIIYQQQlT5Atxl+DY=:A35E
^FO32,224^GFA,32384,32384,00092,:Z64:
eJzt3TGugkAURuGZTEHJDh47eWzJ0sIEljZLmSVYWhhHAzPCy0soyP1jiOc2UJBPnQHtPM4xDPN902bTua7twdZ+rOhgS+ccZUvyZ1H6m+32dfflfP0ZLCbk5fSxcd2uGWI9a4yX5LUo6f+Z1Szvth+tbf/ezMGadu69g/etq/ZNX47efCtfWzjOx3DdvGzXtHE+NsnermZ9Dcupa9GO9rYvdmdPO1fuj1+FfdHbF4Vd3vBZYf/MB8FjWW8QL3gs640ttZPCbiY7aOw42VFhB7ndaOw02aPC9nJb8fVdn5pWQTuHjf1p+yS0z9jY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Nhfb9+E9lH/Jx77E/aooOemxVE7H8r2yVF7MMpGjrLtc9TekbIBNf+yWU9pVymbW0ftkCnbbMqmnLKF1yR7u5rK9qCymahsPUoblcq2Zpes7aUJqmyZKhusynastHnbZlO8X7d6lY1hZRtZ2nS2XZVU0CepxG5C:5941
^FO352,1024^GFA,09984,09984,00052,:Z64:
${guia.m_sLogoEtiqueta}
^FT649,1020^A0I,39,48^FH\\^FD${guia.m_nFolioGuia}^FS
^FT581,985^A0I,35,33^FH\\^FD${guia.m_sSucursalorigen}^FS
^FT745,985^A0I,35,43^FH\\^FDORIGEN:^FS
^FT749,943^A0I,35,45^FH\\^FDREMITENTE^FS
^FT738,885^A0I,31,28^FH\\^FD${guia.m_sNOmbreRemitente}^FS
^FT738,828^A0I,35,45^FH\\^FDTEL:^FS
^FT649,828^A0I,35,40^FH\\^FD${guia.m_sTelefonoRemitente}^FS
^FT738,772^A0I,35,45^FH\\^FDDIRECCIÓN:^FS
${guia.m_sDomicilioRemitente.length > 30 ?
        (
            guia.m_sDomicilioRemitente.length > 70 ? (
                `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                ^FT734,728^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(25, 73)}^FS
                ^FT734,674^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(73)}^FS`
            ) : (
                `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
               ^FT734,728^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(25)}^FS`
            )
        ) : `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente}^FS`}
^FT738,622^A0I,35,45^FH\\^FD${guia.m_sCiudadOrigen}^FS
^FT746,588^A0I,35,45^FH\\^FDDESTINO:^FS
^FT734,530^A0I,31,31^FH\\^FD${guia.m_sNombreDestinatario}^FS
^FT734,474^A0I,35,45^FH\\^FDTEL:^FS
^FT645,474^A0I,35,38^FH\\^FD${guia.m_sTelefonoDestinatario}^FS
^FT734,417^A0I,35,45^FH\\^FDDIRECCIÓN:^FS
^FT749,190^A0I,35,45^FH\\^FD${guia.m_sCiudadDestino}^FS
^FT243,27^A0I,36,24^FH\\^FD${index + 1} DE ${paquete.ctd}^FS
^FT39,1180^BQN,2,6
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
${guia.m_sDomicilioDestinatario.length > 30 ?
        (
            guia.m_sDomicilioDestinatario.length > 70 ? (
                `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT738,367^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(25, 73)}^FS
                 ^FT738,311^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(73)}^FS`
            ) : (
                `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT738,367^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(25, 70)}^FS`
            )
        ) : `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario}^FS`}
^FT411,130^A0I,28,40^FH\\^FDTIPO DE REPARTO^FS
^FT404,79^A0I,45,38^FB315,1,0,C^FH\\^FD${guia.tipoEntrega}^FS
^FT738,259^A0I,35,45^FH\\^FDZO.:${guia.zonaEntrega}^FS
^FT497,206^BQN,2,8
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
^FT411,30^A0I,28,40^FH\\^FDPARTIDA:^FS
^FT553,588^A0I,35,33^FH\\^FD${guia.m_sSucursalDestino}^FS
^PQ1,0,1,Y^XZ
`)
export const TICKET_ZEBRA_TEMPLATE_NOT_QR = (guia, paquete, index) => (
    `CT~~CD,~CC^~CT~
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
^XA
^MMT
^CI28
^PW799
^LL1199
^LS0
^FO32,640^GFA,29440,29440,00092,:Z64:
eJzt3TFqwzAYxXEJDRp9g/giob5WhtDqaDqKjpAxQ6ibRpbjUBqK+V6D4f8Go8H8MJ9lj0/OEUIIIf+e0TZLOhrbZWEPxvZFN5LlUMKYTN+eH/O87i6/37cqw+m+LMZ2vD/sRzK2/efPlVnmpw1nc7vP0yKent22Kl1pi/zkrnUJ7XH7ZG77NubBnHaubcJ3gd1M66/yO9MsvP0WnN+ht9+C171X7VAEdszVzgJ7QqPELtVOAttXu5PYdYP0Atq5s9zeSezD7fomsY+3615i7+X2UWLXSR8k9k5uK37f7atR/L6vfxJs7BfbUWknbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbOzX2J3SdtjYf7WV3Vhb7QtTdqhttVdO2bWn7Ajcam+isksySuxS7Sywp+5OZeeositV2fGq7KZVdupKu4CVHcbK7mVlZ7Sy61rZ0a3sFld2oku73JUd9MrufDea4uHhIITB+DiB5YyVZywoz4awnYr9p0gIIYQQQlT5Atxl+DY=:A35E
^FO32,224^GFA,32384,32384,00092,:Z64:
eJzt3TGugkAURuGZTEHJDh47eWzJ0sIEljZLmSVYWhhHAzPCy0soyP1jiOc2UJBPnQHtPM4xDPN902bTua7twdZ+rOhgS+ccZUvyZ1H6m+32dfflfP0ZLCbk5fSxcd2uGWI9a4yX5LUo6f+Z1Szvth+tbf/ezMGadu69g/etq/ZNX47efCtfWzjOx3DdvGzXtHE+NsnermZ9Dcupa9GO9rYvdmdPO1fuj1+FfdHbF4Vd3vBZYf/MB8FjWW8QL3gs640ttZPCbiY7aOw42VFhB7ndaOw02aPC9nJb8fVdn5pWQTuHjf1p+yS0z9jY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Nhfb9+E9lH/Jx77E/aooOemxVE7H8r2yVF7MMpGjrLtc9TekbIBNf+yWU9pVymbW0ftkCnbbMqmnLKF1yR7u5rK9qCymahsPUoblcq2Zpes7aUJqmyZKhusynastHnbZlO8X7d6lY1hZRtZ2nS2XZVU0CepxG5C:5941
^FO352,1024^GFA,09984,09984,00052,:Z64:
${guia.m_sLogoEtiqueta}
^FT649,1020^A0I,39,48^FH\\^FD${guia.m_nFolioGuia}^FS
^FT581,985^A0I,35,33^FH\\^FD${guia.m_sSucursalorigen}^FS
^FT745,985^A0I,35,43^FH\\^FDORIGEN:^FS
^FT749,943^A0I,35,45^FH\\^FDREMITENTE^FS
^FT738,885^A0I,31,28^FH\\^FD${guia.m_sNOmbreRemitente}^FS
^FT738,828^A0I,35,45^FH\\^FDTEL:^FS
^FT649,828^A0I,35,40^FH\\^FD${guia.m_sTelefonoRemitente}^FS
^FT738,772^A0I,35,45^FH\\^FDDIRECCIÓN:^FS
${guia.m_sDomicilioRemitente.length > 30 ?
        (
            guia.m_sDomicilioRemitente.length > 70 ? (
                `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                ^FT734,728^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(25, 73)}^FS
                ^FT734,674^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(73)}^FS`
            ) : (
                `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
               ^FT734,728^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(25)}^FS`
            )
        ) : `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente}^FS`}
^FT738,622^A0I,35,45^FH\\^FD${guia.m_sCiudadOrigen}^FS
^FT746,588^A0I,35,45^FH\\^FDDESTINO:^FS
^FT734,530^A0I,31,31^FH\\^FD${guia.m_sNombreDestinatario}^FS
^FT734,474^A0I,35,45^FH\\^FDTEL:^FS
^FT645,474^A0I,35,38^FH\\^FD${guia.m_sTelefonoDestinatario}^FS
^FT734,417^A0I,35,45^FH\\^FDDIRECCIÓN:^FS
^FT749,190^A0I,35,45^FH\\^FD${guia.m_sCiudadDestino}^FS
^FT243,27^A0I,36,24^FH\\^FD${index + 1} DE ${paquete.rangoFin}^FS
${guia.m_sDomicilioDestinatario.length > 30 ?
        (
            guia.m_sDomicilioDestinatario.length > 70 ? (
                `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT738,367^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(25, 73)}^FS
                 ^FT738,311^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(73)}^FS`
            ) : (
                `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT738,367^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(25, 70)}^FS`
            )
        ) : `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario}^FS`}
^FT411,130^A0I,28,40^FH\\^FDTIPO DE REPARTO^FS
^FT404,79^A0I,45,38^FB315,1,0,C^FH\\^FD${guia.tipoEntrega}^FS
^FT738,259^A0I,35,45^FH\\^FDZO.:${guia.zonaEntrega}^FS
^FT411,30^A0I,28,40^FH\\^FDPARTIDA:^FS
^FT553,588^A0I,35,33^FH\\^FD${guia.m_sSucursalDestino}^FS
^PQ1,0,1,Y^XZ
`)

// export const TICKET_ZEBRA_TEMPLATE_PSG = (guia, paquete, index) => (`
// CT~~CD,~CC^~CT~
// ^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
// ^XA
// ^MMT
// ^PW812
// ^LL0812
// ^LS0
// ^FO32,0^GFA,05120,05120,00040,:Z64:
// ${guia.m_sLogoEtiqueta}
// ^FT193,78^A0N,39,38^FH\\^FD${guia.m_nFolioGuia}^FS
// ^FT410,141^A0N,28,28^FH\\^FD${guia.m_sCiudadOrigen}^FS
// ^FO46,158^GB697,197,4^FS
// ^FT303,141^A0N,28,28^FH\\^FDORIGEN:^FS
// ^FT53,141^A0N,28,28^FH\\^FDREMITENTE^FS
// ^FT53,191^A0N,28,28^FH\\^FD${guia.m_sNombreRemitente}^FS
// ^FT53,225^A0N,28,28^FH\\^FDTEL:^FS
// ^FT116,225^A0N,28,28^FH\\^FD${guia.m_sTelefonoRemitente}^FS
// ^FT53,265^A0N,28,28^FH\\^FDDIRECCI\\E3N:^FS
// ^FT202,265^A0N,28,24^FH\\^FD${guia.m_sDomicilioRemitente}^FS
// ^FO46,408^GB697,238,4^FS
// ^FT303,390^A0N,28,28^FH\\^FDDESTINO:^FS
// ^FT53,447^A0N,28,28^FH\\^FD${guia.m_sNombreDestinatario}^FS
// ^FT53,487^A0N,28,28^FH\\^FDTEL:^FS
// ^FT116,487^A0N,28,28^FH\\^FD${guia.m_sTelefonoDestinatario}^FS
// ^FT53,521^A0N,28,28^FH\\^FDDIRECCI\\E3N:^FS
// ^FT53,678^A0N,28,28^FH\\^FD${guia.m_sCiudadDestino}^FS
// ^FT359,774^A0N,28,28^FH\\^FD${index + 1} DE ${paquete.ctd}^FS
// ^FT595,219^BQN,2,5
// ^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
// ^FT202,521^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario}^FS
// ^FT202,299^A0N,28,24^FH\\^FD${guia.m_sDomicilioRemitente2}^FS
// ^FT202,337^A0N,28,24^FH\\^FD${guia.m_sDomicilioRemitente3}^FS
// ^FT202,558^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario2}^FS
// ^FT202,596^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario3}^FS
// ^FT53,717^A0N,28,28^FH\\^FDTIPO DE REPARTO^FS
// ^FT286,717^A0N,28,28^FH\\^FD${guia.tipoEntrega}^FS
// ^FT53,635^A0N,28,28^FH\\^FD${guia.zonaEntrega}^FS
// ^FT215,775^A0N,28,28^FH\\^FDPARTIDA:^FS
// ^FT427,390^A0N,28,28^FH\\^FD${guia.m_sSucursalDestino}^FS
// ^FT53,390^A0N,28,28^FH\\^FDDESTINATARIO^FS
// ^PQ1,0,1,Y^XZ
// `)

const logoOmaja = ",:::::::::::::::::::N048903090I10300422120614426C40040100108848082030B0D84204,N08080109010A02007C21202207C40640442001F08480820I10C87C04,N040C021F1E0C06I0403E0420486024085A0C0908F818402I100487C,N03020K20C06I084420440501894086AI0A108810402011084088,N01020K214J030I4044070089808C4I0C11001040I21087088,N0F1E3E1E3E223C002043C7C4020F088F8C4I0810F1F1F3E220F02078,,hL02,,:::::gM01FFEh03IF,M01IFCL01IFCJ0JFC007IFM0IFE07FFEL01IF8K01KF,M01IFCL01IFCI03KF807IF8L0IFE07FFEL01IF8K07KFC,N0IFEL03IF8I07KFC03IF8L0IFC07FFEL01IF8J01MF,N0IFEL03IF8I0MF03IF8K01IFC07FFEL01IF8J07MFC,N0JFL03IFI01MF81IFCK01IF807FFEL01IF8J0NFE,N07IFL07IFI03MFC1IFCK03IF807FFEL01IF8I03OF,N07IFL07IFI07MFE0IFEK03IF807FFEL01IF8I07OF8,N03IF8K07FFEI0NFE0IFEK03IF007FFEL01IF8I0PFC,N03IF8K0IFEI0NFE0JFK07IF007FFEL01IF8001PFE,N01IFCK0IFC001NFC07IFK07FFE007FFEL01IF8001QF,N01IFCJ01IFC001NF807IFK0IFE007FFEI0C001IF8003QF8,N01IFCJ01IF8003NF003IF8J0IFC007FFEI0C001IF8007QF8,O0IFEJ01IF8003IFE03FC003IF8I01IFC007FFE001E001IF800KF003JFC,O0IFEJ03IF8003IF801F8001IF8I01IFC007FFE003F001IF800JFCI0JFC,O07IFJ03IFI03IF80078001IFCI01IF8007FFE003F001IF801JF8I07IFE,O07IFJ07IFI03IFI02I01IFCI03IF8007FFE007F801IF801JFJ01IFE,O03IFJ07FFEI03IFN0IFEI03IFI07FFE00FFC01IF801IFEJ01JF,O03IF8I0IFEI03IFN0IFEI03IFI07FFE00FFC01IF803IFCK0JF,O03IF8I0IFCI03IFN07FFEI07IFI07FFE01FFE01IF803IF8K07IF8,O01IF8I0IFCI03IFN07IFI07FFEI07FFE03IF01IF803IF8K07IF8,O01IFC001IFCI03IFN07IFI0IFEI07FFE03IF01IF807IF8K03IF8,P0IFC001IF8I03IFN03IFI0IFCI07FFE07IF81IF807IFL03IF8,P0IFE001IF8I03IFN03IF800IFCI07FFE0JFC1IF807IFL03IF8,P07FFE003IFJ03IFN01IF801IFCI07FFE0JFC1IF807IFL01IF8,P07FFE003IFJ03IFN01IFC01IF8I07FFE1JFE1IF807FFEL01IF8,P07IF007IFJ03IFO0IFC03IF8I07FFE1KF1IF807FFEL01IF8,P03IF007FFEJ03IFO0IFE03IFJ07FFE3KF1IF807FFEL01IF8,P03IF807FFEJ03IFO0IFE03IFJ07FFE7KF9IF807FFEL01IF8,P01IF80IFCJ03IFO07FFE07FFEJ07FFE7KFDIF807IFL01IF8,P01IF80IFCJ03IFO07IF07FFEJ07SF807IFL03IF8,P01IFC1IF8J03IFO03IF0IFEJ07SF807IFL03IF8,Q0IFC1IF8J03IFO03IF8IFCJ07SF807IF8K03IF8,Q0IFE3IF8J03IFO01IF8IFCJ07SF807IF8K03IF8,Q07FFE3IFK03IFO01IF9IF8J07LF3LF803IF8K07IF8,Q07FFE3IFK03IFO01IFDIF8J07KFE1LF803IFCK0JF,Q03IF7FFEK03IFP0MFK07KFE1LF803IFEK0JF,Q03FFE7FFEK03IFP0MFK07KFC0LF801JFJ01IFE,Q03FFE7FFCK03IFP07LFK07KF80LF801JF8I03IFE,Q01FFCIFCK03IFP07KFEK07KF807KF800JFCI0JFC,Q01FFCIFCK03IFP03KFEK07KF003KF800KF003JFC,R0FFDIF8K03IFP03KFCK07KF003KF8007QF8,R0FF9IF8K03IFP03KFCK07JFE001KF8003QF8,R07F9IFL03IFP01KF8K07JFC001KF8003QF,R07F3IFL03IFP01KF8K07JFCI0KF8001PFE,R07F3IFL03IFQ0KF8K07JF8I07JF8I0PFC,R03F7FFEL03IFQ0KFL07JFJ07JF8I07OF8,R03E7FFEL03IFQ07JFL07JFJ03JF8I03OF,R01EIFCL03IFQ07IFEL07IFEJ01JF8I01NFE,R01EIFCL03IFQ07IFEL07IFEJ01JF8J07MFC,S0CIF8L03IFQ03IFEL07IFCK0JF8J03MF,S0DIF8L03IFQ03IFCL07IF8K07IF8K0LFC,S09IF8L03IFQ01IFCL07IF8K07IF8K03KF,S01IFgH01IF8gM03IF8,iS04,,:::::::::";
const logoMG = "";

export const TICKET_ZEBRA_TEMPLATE = (guia, paquete, indexPartida,paquetesTotales, indexQR) => {
    const rfc = localStorage.getItem("RFC");
    const destino = guia?.m_sCiudadDestino + ', ' + guia?.m_sEstadoDestinatario;
    const origen = guia?.m_sCiudadOrigen + ', ' + guia?.m_sEstadoRemitente;
    const fechaGuia = new Date(guia?.m_dFecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    if(rfc === 'PLG090716IA7') {
        return (`CT~~CD,~CC^~CT~
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
^XA
^MMT
^CI28
^PW812
^LL0812
^LS0
^FO0,0^GFA,07680,07680,00040,:Z64:
${guia.m_sLogoEtiqueta}
^FT41,239^A0N,79,79^FB730,1,0,C^FH\\^FD${guia.m_nFolioGuia}^FS
^FT410,286^A0N,28,28^FH\^FD${guia.m_sSucursalorigen}^FS
^FO46,302^GB697,53,4^FS
^FT303,286^A0N,28,28^FH\^FDORIGEN:^FS
^FT53,286^A0N,28,28^FH\^FDREMITENTE^FS
^FT53,336^A0N,28,28^FH\^FD${guia.m_sNOmbreRemitente}^FS
^FO46,408^GB697,238,4^FS
^FT303,390^A0N,28,28^FH\\^FDDESTINO:^FS
^FT53,447^A0N,28,28^FH\\^FD${guia.m_sNombreDestinatario}^FS
^FT53,487^A0N,28,28^FH\\^FDTEL:^FS
^FT116,487^A0N,28,28^FH\\^FD${guia.m_sTelefonoDestinatario}^FS
^FT53,521^A0N,28,28^FH\\^FDDIRECCIÓN:^FS
^FT53,678^A0N,28,28^FH\\^FD${guia.m_sCiudadDestino}^FS
^FT359,774^A0N,28,28^FH\\^FD${indexPartida + 1} DE ${paquetesTotales}^FS
^FT601,170^BQN,2,6
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${indexQR}^FS
${guia.m_sDomicilioDestinatario.length > 40 ?
            (
                guia.m_sDomicilioDestinatario.length > 80 ? (
                    `^FT202,521^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 40)}^FS
                 ^FT202,558^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario.substring(40, 80)}^FS
                 ^FT202,596^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario.substring(80)}^FS`
                ) : (
                    `^FT202,521^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 40)}^FS
                 ^FT202,558^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario.substring(40, 80)}^FS`
                )
            ) : `^FT202,521^A0N,28,24^FH\\^FD${guia.m_sDomicilioDestinatario}^FS`}
^FT53,717^A0N,28,28^FH\\^FDTIPO DE REPARTO^FS
^FT286,717^A0N,28,28^FH\\^FD${guia.tipoEntrega}^FS
^FT53,635^A0N,28,28^FH\\^FD${guia.zonaEntrega}^FS
^FT215,775^A0N,28,28^FH\\^FDPARTIDA:^FS
^FT427,390^A0N,28,28^FH\\^FD${guia.m_sSucursalDestino}^FS
^FT53,390^A0N,28,28^FH\\^FDDESTINATARIO^FS
^PQ1,0,1,Y^XZ`)
    } else if(rfc === 'TOCA920128HR3') {
        return `CT~~CD,~CC^~CT~
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0

^FX Configuraciones
~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
^XA
^MMT
^CI28
^PW799
^LL1199
^LS0

 ^FXc Borde exterior
^FO30,30^GFA,71535,71535,95,gK01lVFC,gJ0mF8,gH03mHFE,gG03IFElV03IFE,g03IFm07FFE,Y01FFEmH03FFC,Y0FFCmJ01FF8,X07FEmL03FF,W01FEmN03FC,W0FF8mO0FF8,V03FCmP01FE,V0FEmR03F8,U03F8mS0FE,U0FEmT03F8,T03F8mU0FE,T07EmV03F,S01F8mW0FC,S07EmX03F,S0F8mY0F8,R03Fn07E,R07Cn01F,Q01F8nG0FC,Q03EnH03E,Q07CnH01F,P01FnJ07C,P03EnJ03E,P07CnJ01F,P0FnL078,O01EnL03C,O07CnL01F,O0F8nM0F8,N01FnN07C,N03EnN03E,N07CnN01F,N0F8nO0F8,M01FnP07C,M03EnP03E,M07CnP01F,M078nQ0F,M0FnR078,L01EnR03C,L03CnR01E,L078nS0F,L0FnT078,L0EnT038,K01EnT03C,K03CnT01E,K078nU0F,K07nV07,K0FnV078,J01EnV03C,J01CnV01C,J03CnV01E,J078nW0F,J07nX07,J0FnX078,J0EnX038,I01CnX01C,I03CnX01E,I038nY0E,I078nY0F,I07o07,I0Fo078,I0Eo038,001Eo03C,001Co01C,003Co01E,0038oG0E,0078oG0F,007oH07,:00EoH038,:01EoH03C,01CoH01C,:03CoH01E,038oI0E,:07oJ07,::0FoJ078,0EoJ038,::1CoJ01C,:::3CoJ01E,38oK0E,::::7oL07,::::::EoL038,::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::7oL07,::::::38oK0E,::::3CoJ01E,1CoJ01C,:::0EoJ038,::0FoJ078,07oJ07,::038oI0E,:03CoH01E,01CoH01C,:01EoH03C,00EoH038,:007oH07,:0078oG0F,0038oG0E,003Co01E,001Co01C,001Eo03C,I0Eo038,I0Fo078,I07o07,I078nY0F,I038nY0E,I03CnX01E,I01CnX01C,J0EnX038,J0FnX078,J07nX07,J078nW0F,J03CnV01E,J01CnV01C,J01EnV03C,K0FnV078,K07nV07,K078nU0F,K03CnT01E,K01EnT03C,L0EnT038,L0FnT078,L078nS0F,L03CnR01E,L01EnR03C,M0FnR078,M078nQ0F,M07CnP01F,M03EnP03E,M01FnP07C,N0F8nO0F8,N07CnN01F,N03EnN03E,N01FnN07C,O0F8nM0F8,O07CnL01F,O01EnL03C,P0FnL078,P07CnJ01F,P03EnJ03E,P01FnJ07C,Q07CnH01F,Q03EnH03E,Q01F8nG0FC,R07Cn01F,R03Fn07E,S0F8mY0F8,S07EmX03F,S01F8mW0FC,T07EmV03F,T03F8mU0FE,U0FEmT03F8,U03F8mS0FE,V0FEmR03F8,V03FCmP01FE,W0FF8mO0FF8,W01FEmN03FC,X07FEmL03FF,Y0FFCmJ01FF8,Y01FFEmH03FFC,g03IFm07FFE,gG03IFElV03IFE,gH03mHFE,gJ0mF8,gK01lVFC,^FS

^FX Logo
^FO400,665^GFA,4356,4356,44,${logoOmaja}^FS

 ^FX Secciones
^FO70,400^GFA,12155,12155,85,J03nF8,I03nHF8,I0nIFE,003FCn07F8,007EnH0FC,00F8nH03E,01EnJ0F,03CnJ078,078nJ03C,0FnK01E,1EnL0F,1CnL07,3CnL07838nL03878nL03C7nM01C::EnN0E::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::7nM01C::78nL03C38nL0383CnL0781CnL07,1EnL0F,0FnK01E,078nJ03C,03CnJ078,01EnJ0F,00F8nH03E,007EnH0FC,003FCn07F8,I0nIFE,I03nHF8,J03nF8,^FS

^FO70,200^GFA,12155,12155,85,J03nF8,I03nHF8,I0nIFE,003FCn07F8,007EnH0FC,00F8nH03E,01EnJ0F,03CnJ078,078nJ03C,0FnK01E,1EnL0F,1CnL07,3CnL07838nL03878nL03C7nM01C::EnN0E::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::7nM01C::78nL03C38nL0383CnL0781CnL07,1EnL0F,0FnK01E,078nJ03C,03CnJ078,01EnJ0F,00F8nH03E,007EnH0FC,003FCn07F8,I0nIFE,I03nHF8,J03nF8,^FS

^FX Codigo QR superior, despues de FDLA viene el valor del qr
^FT95,775^BQN,2,6
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${indexQR}^FS

^FX Encabezado
^FT730,635^A0I,35,35^FH\\^FD${guia.m_nFolioGuia}^FS
^FT735,600^A0I,25,25^FH\\^FD ORIGEN:^FS
^FT560,600^A0I,25,25^FH\\^FD ${guia.m_sSucursalorigen}^FS

^FX Seccion Remitente
^FT740,555^A0I,35,35^FH\\^FD REMITENTE:^FS
^FT560,555^A0I,35,35^FH\\^FD ${guia.m_sNOmbreRemitente}^FS

^FT740,510^A0I,20,20^FH\\^FD ${guia.m_sNOmbreRemitente}^FS

^FT740,475^A0I,20,20^FH\\^FD TEL:^FS
^FT635,475^A0I,20,20^FH\\^FD ${guia.m_sTelefonoRemitente}^FS

^FT740,445^A0I,20,20^FH\\^FD DIRECCIÓN:^FS
${guia.m_sDomicilioRemitente.length > 55 ?
    (
         `^FT635,445^A0I,20,20^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 55)}^FS
         ^FT740,415^A0I,20,20^FH\\^FD${guia.m_sDomicilioRemitente.substring(55, 110)}^FS`
    ) : 
        `^FT635,445^A0I,20,20^FH\\^FD${guia.m_sDomicilioRemitente}^FS`
}

^FX Seccion Destino
^FT740,360^A0I,35,35^FH\\^FD DESTINO:^FS
^FT560,360^A0I,35,35^FH\\^FD ${guia.m_sSucursalDestino}^FS

^FT740,318^A0I,20,20^FH\\^FD ${guia.m_sNombreDestinatario}^FS

^FT740,290^A0I,20,20^FH\\^FD TEL :^FS
^FT635,290^A0I,20,20^FH\\^FD ${guia.m_sTelefonoDestinatario}^FS

^FT740,265^A0I,20,20^FH\\^FD DIRECCIÓN:^FS
${guia.m_sDomicilioDestinatario.length > 40 ?
    (
        `^FT635,265^A0I,20,20^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 40)}^FS
         ^FT740,240^A0I,20,20^FH\\^FD${guia.m_sDomicilioDestinatario.substring(40, 80)}^FS`
    ) : `^FT635,265^A0I,20,20^FH\\^FD${guia.m_sDomicilioDestinatario}^FS`
}

^FT740,215^A0I,20,20^FH\\^FD ZO:^FS
^FT640,215^A0I,20,20^FH\\^FD ${guia.zonaEntrega}^FS

^FX Tipo de reparto
^FT300,150^A0I,30,30^FH\\^FD TIPO DE REPARTO:^FS
^FT320,100^A0I,45,38^FB315,1,0,C^FH^FD${guia.tipoEntrega == "OCURRE" ? guia.tipoEntrega : "DOMICILIO"}\\&^FS

^FX Numero de pagina
^FT320,60^A0I,30,30^FH\\^FD PARTIDA: ${indexPartida + 1} DE ${paquetesTotales}^FS

^FX QR inferior
^FT540,210^BQN,2,7
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${indexQR}^FS

^XZ`;
    } else if(rfc === 'SOPO110101PQ1') {//MG
        return `CT~~CD,~CC^~CT~
^XA
~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0

^FX Configuraciones
^CI28
^LS0

^FX Logo
^FO50,20^GFA,6880,6880,43,,:::::::::::::::::::::::::::::iV07,iT07JF,hH01NFM03MFCL0MFC,hH01NFM07MFCJ01PF,hH01NFM07MFCJ07PFE,hH01NFM0NFCI03RFC,hH01NF8K01NFC001TF,hH03NF8K01NFC007TF,hH03NF8K01NF801UF,hH03NF8K01NF807TFE,hH03NF8K03NF80UFE,hH07NF8K03NF81UFC,hH07NF8K07NF87UFC,hH07NF8K07NF0VFC,hH07NF8K07NF3VFC,hH07NF8K0gLFC,hH07NF8K0gLF8,hH07NF8J01gLF8,hH0OF8J01gLF,hH0OF8J03gLF,:hG01OF8J03gKFE,hG01OF8J07gKFE,hG01OF8J07IFDTF8003IFE,hG01JFDJF8J0JFDRFE8J05FFC,hG03JFDJF8J0JF9RFN07C,1hKFDJF8J0JF9QFCN03C,1hKF8JF8I01JF9QF,0hKF8JF8I01JF3PFE,0hKF8JF8I03JF3PF8,07hJF8JF8I03IFE3PF,07hJF8JFCI07IFE3OFE,03hJF8JFCI07IFC3OFC,03hJF8JFCI07IFC3OF8,01hJF0JFCI0JF87OF,01hJF0JFCI0JF87NFE,00hJF0JFC001JF87NFC,00hIFE0JFC001JF07NFC,007IFCI0F0FFE1F003FF801FFCI0FF807FF007JFE0JFC003JF07NF8,007IF8I070FFE1EI0FFI03F8I0FE001FC003JFE0JFC003IFE0OF8,007IF8I0707FC1EI03FI01F8I0FC001F8003JFE0JFC003IFE0OF,003IF8I0F87FC3EI03FJ0F8I0F8003F8003JFE0JFC007IFC0OF,003IF8061F83F83E0F81F07C0F8219F83F3F03E7JFE07IFC007IFC0NFE,001IF87IF83F87E1FC0F0FE0787IF07IF0MFE07IFC007IF80NFEK01NFE,001IF87IFC1F07E1FE0F0FF0787IF0IFE0MFE07IFC00JF80NFCK01OF,001IF87IFC1F0FE1FF0F0FF8787IF0IFE1MFC07IFE00JF80NFCK01OF,I0IF87IFE0E0FE1FF0F0FF8787IF0IFE1MFC07IFE01JF00NFCK01OF,I07FF87IFE0E1FE1FF0F0FF8787IF0IFE0MF807IFE01JF00NF8K01OF,I07FF87JF0C1FE1FF0F0FF8787IF0IFE0MF807IFE03IFE00NF8K03NFE,I07FF87JF043FE1FF0F0FF8787IF07IF0MF807IFE03IFE01NF8K03NFE,I03FF87JF803FE1FF0F0FF0787IF03IF07LF807IFE03IFC01NF8K03NFE,I03FF83JF807FE1FE0F0FF0F83IF80IF01LF807IFE07IFC01NF8K07NFE,I01FF8I0FFC07FE1FE0F0FC0F8001FC03FF807KF807IFE07IFC01NFL07NFE,J0FF8I0FFC0FFE1F81FI01F8I0FC01FFC01KF007IFE0JF803NFL03NFC,J0FF8I0FFE0FFE0E03FI03F8I0FF007FE00KF807IFE0JF803NFL07NFC,I01FF8I0FFC0FFEI03FI07F8001FF803FF007JF007IFE1JF003NFL07NFC,I01FF83JFC07FEI07FI03F87JFE03FFE03JF007IFE1JF003NFL07NFC,I03FF87JF807FE001FF0F03F87KF81IF03JF007IFE1JF003NFL07NFC,I03FF87JF803FE07IF0FC1F87KFC1IFC1JF007IFE3IFE003NFL07NFC,I07FF87JF043FE1JF0FE1F87KFE0IFC1IFE007IFE3IFC003NFL07NFC,I07FF87JF0C1FE1JF0FE0F87KFE0IFE1IFE007IFE7IFC003NFL0OFC,I0IF87IFE0E1FE1JF0FF0F87LF0IFE1IFE007IFE7IFC003NF8K0OF8,I0IF87IFE1E0FE1JF0FF0F87LF0IFE1IFE007IFE7IF8007NF8K07NF8,001IF87IFC1F0FE1JF0FF0F87LF0IFE1IFE003NF8007NF8N07KF8,001IF83IFC3F07E1JF0FF0F87KFE0IFE1IFC003NFI07NF8N07KF8,003IF87IF83F87E1JF0FF8787KFE1IFC1IFC003NFI0OFCN0LF,007IF83IF87F83E1JF0FF8783IF3FC1E7F83IFC003MFEI0OFCN0LF,007IF8I0707FC3E1JF0FF878I070201E0603IFC003MFEI0OFCN0LF,007IF8I0707FC1E1JF0FF878I06I03EI07IFC003MFEI0OFEN0LF,00JF8I060FFE1E1JF0FF838I07I07EI0JF8003MFCI0OFEN0LF,01JFCI060FFE0E1JF0FFC38I07800FF001JF8003MFCI0PFM01LF,01gQF07IF0KF8003MF8I0PFM01KFE,01hHFI03MF8001PF8L01KFE,03hHFI03MF8001PFCL01KFE,07hHFI01MFI01PFEL01KFE,07hHFI01LFEI01QFL03KFE,0hIFI01LFEI01QF8K03KFE,0hIFI01LFEI01QFEK03KFC,1hIFI01LFCI01RF8J03KFC,1hIFI01LFCI01RFCJ03KFC,gX03JFEI01LF8I03gIFC,:gX03JFEI01LFJ03gIFC,gX03JFEI01LFJ07gIF8,gX07JFCI01LFJ03gIF8,gX07JFCI01KFEJ07gIF8,gX07JFCI01KFCJ07gIF8,::gX07JFCI01KFCJ07KF3WF8,gX0KF8I01KF8J07KF1WF8,gX0KF8I01KF8J07KF0WF,gX0KF8I01KFK07KF0WF,gW01KF8I01KFK0LF03VF,gW01KF8I01JFEK0LF01UFE,gW01KFJ01JFEK0LF007TFE,gW01KFJ01JFCJ01LF001TFE,gW03KFJ01JFCJ01LFI0TFC,gW03KFK0JF8J01KFEI03RFC,gW03KFT01KFEJ0QFE,gW03JFET01KFEJ01OFE,iP0MFE,iQ03IF8,,::::::::::::::::::::::::::^FS

 ^FX Cuadro Folio
^FO980,30^GFA,3296,3296,32,K01hQFC,J01hSFC,J07hTF,I01FEhQ03FC,I07FhS07F,I0F8hT0F8,003FhU07E,007ChU01F,00F8hV0F8,01EhW03C,03ChW01E,038hX0E,078hX0F,0FhY078,0EhY038,1EhY03C,1ChY01C,38i0E,:78i0F,7iG07,::EiG038::::::::::::::::::::::::::::::::::::::::::::::::::::::::7iG07,::78i0F,38i0E,:1ChY01C,1EhY03C,0EhY038,0FhY078,078hX0F,038hX0E,03ChW01E,01EhW03C,00F8hV0F8,007ChU01F,003FhU07E,I0F8hT0F8,I07FhS07F,I01FEhQ03FC,J07hTF,J01hSFC,K01hQFC,^FS

^FX Cuadricula datos 50,200
^FO50,200^GFA,82140,82140,148,L0tIFE,K0tKFE,J07tLFC,I01FFnO0EkS01FF,I07FnP0EkT01FC,I0FCnP0EkU07E,001FnQ0EkU01F,003CnQ0EkV078,00F8nQ0EkV03E,00FnR0EkV01E,01EnR0EkW0F,03CnR0EkW078,078nR0EkW03C,0FnS0EkW01E,0EnS0EkX0E,1EnS0EkX0F,1CnS0EkX07,3CnS0EkX07838nS0EkX038:7nT0EkX01C:::EnT0EkY0E:::::::::::::::::::::::::::::::::::::::::::::::::::::::nUFEkY0E::EnT0EkY0E::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::nUFEkY0E::EnT0EkY0E::::::::::::::::::::::::::::::::::::nUFEkY0E::EiO0EkJ0EkY0E::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::nUFEkY0E::EiO0EkJ0EkY0E:::::::::::::::::::::::::7iO0EkJ0EkX01C:::38iN0EkJ0EkX038:3CiN0EkJ0EkX0781CiN0EkJ0EkX07,1EiN0EkJ0EkX0F,0EiN0EkJ0EkX0E,0FiN0EkJ0EkW01E,078iM0EkJ0EkW03C,03CiM0EkJ0EkW078,01EiM0EkJ0EkW0F,00FiM0EkJ0EkV01E,00F8iL0EkJ0EkV03E,003CiL0EkJ0EkV078,001FiL0EkJ0EkU01F,I0FCiK0EkJ0EkU07E,I07FiK0EkJ0EkT01FC,I01FFiJ0EkJ0EkS01FF,J07tLFC,K0tKFE,L0tIFE,,:^FS

^FX Numero de pagina
^FT850,50^A0N,25,25^FH\\^FDPágina ${indexPartida + 1}/${paquetesTotales}^FS

^FX Encabezado
^FT470,50^A0N,35,45^FH\\^FDEXPRESS MG^FS
^FT420,90^A0N,25,25^FH\\^FDSERVICIO PUBLICO FEDERAL DE CARGA REGULAR^FS
^FT420,120^AJN,25,25^FH\\^FDAVENIDA TRANSPORTISTAS NO. 414 COL.^FS
^FT420,150^AJN,25,25^FH\\^FDFRACCION DE LOS GOMEZ CP. 37140^FS
^FT420,180^AJN,25,25^FH\\^FDTEL: 4774704000.^FS
^FT650,180^AJN,25,25^FH\\^FDRFC: EMG910926HN6^FS

^FX Seccion documentador
^FT1020,160^A0N,25,25^FH\\^FDDocumentador:^FS
^FT1020,190^AJN,20,20^FH\\^FD${guia.m_sCreadoPor}^FS

^FX Seccion cuadro Folio
^FT1000,70^A0N,35,35^FH\\^FDSERIE Y FOLIO:^FS
^FT1000,110^A0N,35,35^FH\\^FD${guia.m_nFolioGuia}^FS

^FX Fecha y tipo
^FT100,240^A0N,30,30^FH\\^FDLugar y Fecha:^FS
^FT80,270^AJN,25,25^FH\\^FD${fechaGuia.toLocaleDateString('es-MX', opciones)}^FS
^FT400,240^A0N,25,25^FH\\^FDTipo Cobro: ^FS
^FT400,270^A0N,25,25^FH\\^FD${guia.m_sTipoCobro}^FS

^FX Remitente Destinatario
^FT60,310^A0N,25,25^FH\\^FDRemitente:^FS
^FT250,310^AJN,20,20^FH\\^FD${guia.m_sNOmbreRemitente}^FS
^FT60,340^A0N,25,25^FH\\^FDRFC:^FS
^FT250,340^AJN,20,20^FH\\^FD${guia.m_sRFCRemitente}^FS
^FT60,370^A0N,25,25^FH\\^FDDestinatario:^FS
^FT250,370^AJN,20,20^FH\\^FD${guia.m_sNombreDestinatario}^FS
^FT60,400^A0N,25,25^FH\\^FDRFC:^FS
^FT250,400^AJN,20,20^FH\\^FD${guia.m_sRFCDestinatario}^FS
^FT60,430^A0N,25,25^FH\\^FDDirección:^FS
^FT250,430^AJN,20,20^FH\\^FD${guia.m_sCalleDestinatario}^FS
^FT60,460^A0N,25,25^FH\\^FDColonia:^FS
^FT250,460^AJN,20,20^FH\\^FD${guia.m_sColoniaDestinatario}^FS
^FT60,490^A0N,25,25^FH\\^FDCiudad y Edo.:^FS
^FT250,490^AJN,20,20^FH\\^FD${guia.m_sCiudadDestino}, ${guia.m_sEstadoDestinatario}^FS
^FT60,520^A0N,25,25^FH\\^FDTel. y C.P:^FS
^FT250,520^AJN,20,20^FH\\^FD${guia.m_sTelefonoDestinatario} cp.${guia.m_sCodigoPostalDestinatario}^FS

^FX Entregar en
^FT70,570^A0N,25,25^FH\\^FDEntregar en:^FS

^FX Cantidad
^FT70,610^A0N,20,20^FH\\^FDCANTIDAD^FS
^FT70,640^AJN,20,20^FH\\^FD${paquetesTotales} ${paquete.m_sEmbalaje}^FS

^FX Descripción
^FT350,610^A0N,20,20^FH\\^FDDESCRIPCION^FS
^FT350,640^AJN,20,20^FH\\^FD${paquete.m_sDescripcion}^FS

^FX Folio Rastreo
^FT70,740^AJN,20,20^FH\\^FDFolio Rastreo:^FS
^FT210,740^A0N,15,15^FH\\^FD${guia.m_nTracking}^FS

^FX Tipo de entrega
^FT350,740^AJN,20,20^FH\\^FDTipo de entrega:^FS
^FT550,740^A0N,20,20^FH\\^FD${guia.tipoEntrega == "OCURRE" ? guia.tipoEntrega : "DOMICILIO CLIENTE"}^FS

^FX Encabezado QR
${origen.length > 17 ? (
            `
    ^FT780,270^A0N,35,45^FH\\^FD${origen.origen(0, 17)}^FS
    ^FT780,310^A0N,35,45^FH\\^FD${origen.origen(17, 34)}^FS
    `
        ) : `^FT780,270^A0N,35,45^FH\\^FD${origen}^FS`}

${destino.length > 17 ? (
    `
    ^FT780,350^A0N,35,45^FH\\^FD${destino.substring(0, 17)}^FS
    ^FT780,390^A0N,35,45^FH\\^FD${destino.substring(17, 34)}^FS
    `
        ) : `^FT780,350^A0N,35,45^FH\\^FD${destino}^FS`}

^FX QR
^FT900,680^BQN,2,10
^FH\\^FDLA,${guia.m_nTracking}^FS

^XZ`;
    }
    else{
        return (`CT~~CD,~CC^~CT~
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
^XA
^MMT
^CI28
^PW799
^LL1199
^LS0
^FO32,640^GFA,29440,29440,00092,:Z64:
eJzt3TFqwzAYxXEJDRp9g/giob5WhtDqaDqKjpAxQ6ibRpbjUBqK+V6D4f8Go8H8MJ9lj0/OEUIIIf+e0TZLOhrbZWEPxvZFN5LlUMKYTN+eH/O87i6/37cqw+m+LMZ2vD/sRzK2/efPlVnmpw1nc7vP0yKent22Kl1pi/zkrnUJ7XH7ZG77NubBnHaubcJ3gd1M66/yO9MsvP0WnN+ht9+C171X7VAEdszVzgJ7QqPELtVOAttXu5PYdYP0Atq5s9zeSezD7fomsY+3615i7+X2UWLXSR8k9k5uK37f7atR/L6vfxJs7BfbUWknbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbOzX2J3SdtjYf7WV3Vhb7QtTdqhttVdO2bWn7Ajcam+isksySuxS7Sywp+5OZeeositV2fGq7KZVdupKu4CVHcbK7mVlZ7Sy61rZ0a3sFld2oku73JUd9MrufDea4uHhIITB+DiB5YyVZywoz4awnYr9p0gIIYQQQlT5Atxl+DY=:A35E
^FO32,224^GFA,32384,32384,00092,:Z64:
eJzt3TGugkAURuGZTEHJDh47eWzJ0sIEljZLmSVYWhhHAzPCy0soyP1jiOc2UJBPnQHtPM4xDPN902bTua7twdZ+rOhgS+ccZUvyZ1H6m+32dfflfP0ZLCbk5fSxcd2uGWI9a4yX5LUo6f+Z1Szvth+tbf/ezMGadu69g/etq/ZNX47efCtfWzjOx3DdvGzXtHE+NsnermZ9Dcupa9GO9rYvdmdPO1fuj1+FfdHbF4Vd3vBZYf/MB8FjWW8QL3gs640ttZPCbiY7aOw42VFhB7ndaOw02aPC9nJb8fVdn5pWQTuHjf1p+yS0z9jY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Nhfb9+E9lH/Jx77E/aooOemxVE7H8r2yVF7MMpGjrLtc9TekbIBNf+yWU9pVymbW0ftkCnbbMqmnLKF1yR7u5rK9qCymahsPUoblcq2Zpes7aUJqmyZKhusynastHnbZlO8X7d6lY1hZRtZ2nS2XZVU0CepxG5C:5941
^FO352,1024^GFA,09984,09984,00052,:Z64:
${guia.m_sLogoEtiqueta}
^FT649,1020^A0I,39,48^FH\\^FD${guia.m_nFolioGuia}^FS
^FT581,985^A0I,35,33^FH\\^FD${guia.m_sSucursalorigen}^FS
^FT745,985^A0I,35,43^FH\\^FDORIGEN:^FS
^FT749,943^A0I,35,45^FH\\^FDREMITENTE^FS
^FT738,885^A0I,31,28^FH\\^FD${guia.m_sNOmbreRemitente}^FS
^FT738,828^A0I,35,45^FH\\^FDTEL:^FS
^FT649,828^A0I,35,40^FH\\^FD${guia.m_sTelefonoRemitente}^FS
^FT738,772^A0I,35,45^FH\\^FDDIRECCIÓN:^FS
${guia.m_sDomicilioRemitente.length > 30 ?
            (
                guia.m_sDomicilioRemitente.length > 70 ? (
                    `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                ^FT734,728^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(25, 73)}^FS
                ^FT734,674^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(73)}^FS`
                ) : (
                    `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
               ^FT734,728^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente.substring(25)}^FS`
                )
            ) : `^FT496,772^A0I,35,28^FH\\^FD${guia.m_sDomicilioRemitente}^FS`}
^FT738,622^A0I,35,45^FH\\^FD${guia.m_sCiudadOrigen}^FS
^FT746,588^A0I,35,45^FH\\^FDDESTINO:^FS
^FT734,530^A0I,31,31^FH\\^FD${guia.m_sNombreDestinatario}^FS
^FT734,474^A0I,35,45^FH\\^FDTEL:^FS
^FT645,474^A0I,35,38^FH\\^FD${guia.m_sTelefonoDestinatario}^FS
^FT734,417^A0I,35,45^FH\\^FDDIRECCIÓN:^FS
^FT749,190^A0I,35,45^FH\\^FD${guia.m_sCiudadDestino}^FS
^FT243,27^A0I,36,24^FH\\^FD${indexPartida + 1} DE ${paquetesTotales}^FS
^FT39,1180^BQN,2,6
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${indexQR}^FS
${guia.m_sDomicilioDestinatario.length > 30 ?
            (
                guia.m_sDomicilioDestinatario.length > 70 ? (
                    `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT738,367^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(25, 73)}^FS
                 ^FT738,311^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(73)}^FS`
                ) : (
                    `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT738,367^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario.substring(25, 70)}^FS`
                )
            ) : `^FT496,417^A0I,35,28^FH\\^FD${guia.m_sDomicilioDestinatario}^FS`}
^FT411,130^A0I,28,40^FH\\^FDTIPO DE REPARTO^FS
^FT404,79^A0I,45,38^FB315,1,0,C^FH\\^FD${guia.tipoEntrega}^FS
^FT738,259^A0I,35,45^FH\\^FDZO.:${guia.zonaEntrega}^FS
^FT497,206^BQN,2,8
^FH\\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${indexQR}^FS
^FT411,30^A0I,28,40^FH\\^FDPARTIDA:^FS
^FT553,588^A0I,35,33^FH\\^FD${guia.m_sSucursalDestino}^FS
^PQ1,0,1,Y^XZ`)}
}

export const TOOLBAR_OPTIONS = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
    inline: {inDropdown: true},
    list: {inDropdown: true},
    textAlign: {inDropdown: true},
    link: {inDropdown: true},
    history: {inDropdown: true},
};

