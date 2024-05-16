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

export const TICKET_ZEBRA_TEMPLATE = (guia, paquete, indexPartida,paquetesTotales, indexQR) => {
    return localStorage.getItem("RFC") === 'PLG090716IA7' ?
        (`CT~~CD,~CC^~CT~
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
        :
        (`CT~~CD,~CC^~CT~
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
^PQ1,0,1,Y^XZ`)
}

export const TOOLBAR_OPTIONS = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
    inline: {inDropdown: true},
    list: {inDropdown: true},
    textAlign: {inDropdown: true},
    link: {inDropdown: true},
    history: {inDropdown: true},
};

