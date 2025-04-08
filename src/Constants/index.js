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
^FO620,50^GFA,6880,6880,20,,::R03R03,R03CQ0F,R03FP03F,R03F8O0FF,R03FFN03FF,R03FF8M0IF,R03IFL07IF,R03IF8J01JF,R03IFEJ0KF,R03JF8001KF,R03JFE00LF,R03KF83LF,R03KFE7LF,R03SF,::::::::R03FFM01IF,R03FEN0IF,::R03FE0BF81FE0IF,R03FE1FFC3FE0IF,::R03FE1FFC3FF0IF,:R03FE1FFC3FE0IF,:::R03FE1FFC3FF0IF,R03FE1LF9IF,R03SF,:R03FE7PF,R03FE1LF8IF,R03FE07JFC0IF,R03FE01JF00IF,R03FE007FFC00IF,R03FF801FF003IF,R03IF007C00JF,R03IFC01003JF,R03JFJ0KF,R03JFC007KF,R03JFE00LF,R03JF8003KF,R03IFEJ0KF,R03IF803803JF,R03FFE00FE00JF,R03FF803FF803IF,R03FE00IFE00IF,R03FE03JF80IF,R03FE0KFE0IF,R03FE3LF8IF,R03FEQF,R03SF,::R03FEM01IF,R03FEN0IF,::R03JFE0FFE0IF,R03JFE1IF0IF,R03KF1IF0IF,:R03KF0IF0IF,:R03KF07FE0IF,R03KF07FC1IF,R03KF81F81IF,R03KF8I03IF,R03KFCI03IF,R03LFI0JF,R03LF801JF,R03SF,:::R03FEM01IF,R03FEN0IF,::R03KF87FE0IF,R03KF87FF0IF,::R03KF07FF0IF,:R03JFE03FE0IF,R03JF803FC1IF,R03IF8I0F81IF,R03FFI02I01IF,R03FEI0FI03IF,R03FE003F8007IF,R03FE07FFE01JF,R03FE7PF,R03SF,::R03FEM01IF,R03FEN0IF,::R03FE0FFC1FE0IF,R03FE1FFC3FF0IF,R03FE1FFC3FE0IF,:::R03FE1FFC3FF0IF,:R03FE1FFC3FE0IF,:R03FE1FFE7FF0IF,R03FE1PF,R03SF,:R03FFBPF,R03FF0IFE01JF,R03FE0IFC007IF,R03FE1IFI03IF,R03FE1IFI01IF,R03FC1FFE07C1IF,R03FC1FFC0FE0IF,R03FC3FFC1FF0IF,R03FC1FF81FF0IF,R03FC1FF83FF0IF,R03FE1FF03FF0IF,R03FE0FE07FF0IF,R03FE0380IF0IF,R03FFJ0FFE0IF,R03FF8001FFE1IF,R03FFC007IF9IF,R03IF81NF,R03SF,::R03FF0JF83JF,R03FE0IFC00JF,R03FE1IF8003IF,M078I03FE1IFI01IF,M07F8003FE1FFE0181IF,M07FF003FC1FFC0FE0IF,M07IFC3FC3FFC1FE0IF,M07LFC3FFC1FF0IF,M07LFC1FF83FF0IF,M07LFE1FF03FF0IF,M07LFE0FF07FF0IF,M07LFE07C07FF0IF,M07MFJ0FFE0IF,M07MF8001FFE0IF,M07MFC003IF1IF,M07NF00NF,M07XF,::M07XF8,M07YF8,M07gF,M07gGFE,M07gHFE,M03gJF,N01gIF,P0gHF,Q03gF,R03YF,T03WF,U07VF,V03UF,W01TF,X017RF,g01QF,gG07PF,gI07NF,gJ0NF,gK01LF,gL03KF,gK01LF,gH0PF,V01UF,T0XF,N0gJF,M01gJF,:::::::::::M01gIF,M01VFE,M01SF8,M01NFE,:N0OFC,N03OF,O0OFE,O03OF8,P0OFE,Q0OFC,Q07OF,R0OFC,R03OF8,S0PF,S01OFC,T0PF,T01OFE,U07OF8,V0OFE,V03OFC,W0PF,W01OFE,X0PF8,X01OFE,Y07OFC,g0PF,M07CQ03PF,M07F8Q0PF8,M07IFAO01OFE,M07JFCO07OF,M07LFCM01OF,M07NF8L07NF,M07OFM0NF,M07QF8J03MF,M07RF8J0MF,M07TFE003LF,M07VF007KF,M07WFC1KF,M07gJF,:::::::::::N0gJF,P07gGF,:P0gHF,O01gHF,O07gHF,:O0gIF,N01gIF,N01YFE7FF,N03YFE03F,N03gF,N07gF,N0gGF8,N0gGFC,M01gGFC,M01gGFE,M03OF803PF,M03NF8I01OF8,M03MFCK03NF8,M07MFM0NFC,M07LFCM03MFC,M07LF8N0MFE,M07LFO03LFE,M07KFEO01MF,M0LFCP0MF,M0LF8P07LF,M0LF8P03LF8,M0LFQ01LF8,M0LFR0LF8,M0KFER07KFC,L01KFCR07KFC,L01KFCR03KFE,L01KFCR01KFE,:L01KFCS0KFE,:L01KFCS07KF,::L01KFCS03KF,L01KFCJ0CN07KF,L01KFCI01FF6L03KF8,L01KFCI01IFCK03KF8,L01KFCI01JFEJ03KF8,:M0KFCI01JFEJ01KF8,:::M0KFCI01JFEJ01KFC,M0LFE001JFEJ01KFC,M0NF01JFEJ01KFC,M0OF9JFEJ01KF8,M0TFEJ01KF8,:M07SFEJ01KF8,::M07SFEJ03KF8,M03SFEJ03KF8,M03SFEJ03KF,M03SFEJ07KF,M03SFEJ03KF,M01SFEJ07KF,::N0SFEJ07JFE,::N0SFEJ0KFE,N07RFEI01KFE,O0RFEI01KFE,O01QFEI01KFC,Q01OFEI01KFC,S07MFEJ03JFC,T01LFEK07IF8,V07JFEL0IF8,W07IFEL03FF8,Y07FEM01F,g03CN07,,:::::::^FS

^FX Cuadro Folio
^FO670,980^GFA,3289,3289,13,K01TF,J01VF,J07VFC,I01FET0FF,I07FU01FC,I0F8V03E,003FW01F8,007CX07C,00F8X03E,01Eg0F,03Cg078,038g038,078g03C,0FgG01E,0EgH0E,1EgH0F,1CgH07,38gH038:78gH03C7gI01C::EgJ0E::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::7gI01C::78gH03C38gH038:1CgH07,1EgH0F,0EgH0E,0FgG01E,078g03C,038g038,03Cg078,01Eg0F,00F8X03E,007CX07C,003FW01F8,I0F8V03E,I07FU01FC,I01FET0FF,J07VFC,J01VF,K01TF,^FS

^FX Cuadricula datos 50,200
^FO50,50^GFA,82810,82810,70,L03lKFE,K03lMFE,J01lOFC,J07FCL0EgT0EO0EhY0ES01FF,I01FCM0EgT0EO0EhY0ET01FC,I03FN0EgT0EO0EhY0EU07E,I07CN0EgT0EO0EhY0EU01F,I0FO0EgT0EO0EhY0EV078,003EO0EgT0EO0EhY0EV03E,003CO0EgT0EO0EhY0EV01E,0078O0EgT0EO0EhY0EW0F,00FP0EgT0EO0EhY0EW078,01EP0EgT0EO0EhY0EW03C,03CP0EgT0EO0EhY0EW01E,038P0EgT0EO0EhY0EX0E,078P0EgT0EO0EhY0EX0F,07Q0EgT0EO0EhY0EX07,0FQ0EgT0EO0EhY0EX078,0EQ0EgT0EO0EhY0EX038,:1CQ0EgT0EO0EhY0EX01C,:::38Q0EgT0EO0EhY0EY0E,:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::3hMFEO0EhY0EY0E,::38Q0EgT0EO0EhY0EY0E,::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::3lWFE,::38lV0E,:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::1ClU01C,:::0ElU038,:0FlU078,07lU07,078lT0F,038lT0E,03ClS01E,01ElS03C,00FlS078,0078lR0F,003ClQ01E,003ElQ03E,I0FlQ078,I07ClO01F,I03FlO07E,I01FClM01FC,J07FClK01FF,J01lOFC,K03lMFE,L03lKFE,^FS

^FX Numero de pagina
^FT750,850^A0R,25,25^FH\\^FDPágina ${indexPartida + 1}/${paquetesTotales}^FS

^FX Encabezado
^FT750,470^A0R,35,45^FH\\^FDEXPRESS MG^FS
^FT710,420^A0R,25,25^FH\\^FDSERVICIO PUBLICO FEDERAL DE CARGA REGULAR^FS
^FT680,420^ANR,25,25^FH\\^FDAVENIDA TRANSPORTISTAS NO. 414 COL.^FS
^FT650,420^ANR,25,25^FH\\^FDFRACCION DE LOS GOMEZ CP. 37140^FS
^FT620,420^ANR,25,25^FH\\^FDTEL: 4774704000.^FS
^FT620,650^ANR,25,25^FH\\^FDRFC: EMG910926HN6^FS

^FX Seccion documentador
^FT645,1020^A0R,25,25^FH\\^FDDocumentador:^FS
^FT620,1020^ANR,20,20^FH\\^FD${guia.m_sCreadoPor}^FS

^FX Seccion cuadro Folio
^FT730,1000^A0R,35,35^FH\\^FDSERIE Y FOLIO:^FS
^FT690,1000^A0R,35,35^FH\\^FD${guia.m_nFolioGuia}^FS

^FX Fecha y tipo
^FT570,100^A0R,30,30^FH\\^FDLugar y Fecha:^FS
^FT540,80^ANR,25,25^FH\\^FD${fechaGuia.toLocaleDateString('es-MX', opciones)}^FS
^FT570,400^A0R,25,25^FH\\^FDTipo Cobro:^FS
^FT540,400^A0R,25,25^FH\\^FD${guia.m_sTipoCobro}^FS

^FX Remitente Destinatario +150, 0
^FT500,60^A0R,25,25^FH\\^FDRemitente:^FS
^FT500,230^ANR,20,20^FH\\^FD${guia.m_sNOmbreRemitente}^FS
^FT470,60^A0R,25,25^FH\\^FDRFC:^FS
^FT470,230^ANR,20,20^FH\\^FD${guia.m_sRFCRemitente}^FS
^FT440,60^A0R,25,25^FH\\^FDDestinatario:^FS
^FT440,230^ANR,20,20^FH\\^FD${guia.m_sNombreDestinatario}^FS
^FT410,60^A0R,25,25^FH\\^FDRFC:^FS
^FT410,230^ANR,20,20^FH\\^FD${guia.m_sRFCDestinatario}^FS
^FT380,60^A0R,25,25^FH\\^FDDirección:^FS
^FT380,230^ANR,20,20^FH\\^FD${guia.m_sCalleDestinatario}^FS
^FT350,60^A0R,25,25^FH\\^FDColonia:^FS
^FT350,230^ANR,20,20^FH\\^FD${guia.m_sColoniaDestinatario}^FS
^FT320,60^A0R,25,25^FH\\^FDCiudad y Edo.:^FS
^FT320,230^ANR,20,20^FH\\^FD${guia.m_sCiudadDestino}, ${guia.m_sEstadoDestinatario}^FS
^FT290,60^A0R,25,25^FH\\^FDTel. y C.P:^FS
^FT290,230^ANR,20,20^FH\\^FD${guia.m_sTelefonoDestinatario} cp.${guia.m_sCodigoPostalDestinatario}^FS

^FX Entregar en
^FT255,70^A0R,25,25^FH\\^FDEntregar en:^FS

^FX Cantidad
^FT210,70^A0R,20,20^FH\\^FDCANTIDAD^FS
^FT180,70^ANR,20,20^FH\\^FD${paquetesTotales} ${paquete.m_sEmbalaje}^FS

^FX Descripción
^FT210,350^A0R,20,20^FH\\^FDDESCRIPCION^FS
^FT180,350^ANR,20,20^FH\\^FD${paquete.m_sDescripcion}^FS

^FX Folio Rastreo
^FT75,60^ANR,20,20^FH\\^FDFolio Rastreo:^FS
^FT75,190^A0R,18,18^FH\\^FD${guia.m_nTracking}^FS

^FX Tipo de entrega
^FT75,350^ANR,20,20^FH\\^FDTipo de entrega:^FS
^FT75,520^A0R,20,20^FH\\^FD${guia.tipoEntrega == "OCURRE" ? guia.tipoEntrega : "DOMICILIO CLIENTE"}^FS

^FX Encabezado QR
${origen.length > 17 ? (
            `
    ^FT550,780^A0R,35,45^FH\\^FD${origen.origen(0, 17)}^FS
    ^FT510,780^A0R,35,45^FH\\^FD${origen.origen(17, 34)}^FS
    `
        ) : `^FT550,780^A0R,35,45^FH\\^FD${origen}^FS`}

${destino.length > 17 ? (
            `
    ^FT450,780^A0R,35,45^FH\\^FD${destino.substring(0, 17)}^FS
    ^FT410,780^A0R,35,45^FH\\^FD${destino.substring(17, 34)}^FS
    `
        ) : `^FT450,780^A0R,35,45^FH\\^FD${destino}^FS`}

^FX QR
^FT150,1120^BQR,2,10
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

