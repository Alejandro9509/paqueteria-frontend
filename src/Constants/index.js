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
^PW799
^LL1199
^LS0
^FO32,192^GFA,26496,26496,00092,:Z64:
eJzt3D9ugzAYhnFbDIy+QblIlVwrQ1V8NB/FR8jIENVtARNQ1DaKvrct0vMteEA/IfNHTI9zDMMwjHiK4Qwb2VvSpbyt7WBrl7Sye2N72GxJNLx3zXpT2mIoj3hc1t3w9XkPTZ+vy2Rsh+vFGm/Jx6Zcbldms1xteza3j3FehGxud6ku4jdnPTZtnhdHc9o1dZtf7W1fH0L7x2QxvfVb+TnzXjT2j+ByD5sssLvp0CaBHeJkR4E9o0Fip8kW0K6Z7E5i5/FwUNj+LLdfFLabXvaTxD7t2lZ8ButdVHwGnXtW215jj2+NzxL7CRv7XlvyC1HthI2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY39n22vtDM29h/bwnbQXntK0sbUXrtbSlvZUDso6F/oyilbe8pGoLJtqGwyKluSygamst2pbI4qW6nSxquyTats6ipbwMqGsbK9rGxGS1vXyka3si1unInfhuJ7Y3u9x8oGvbKdzzA/zDtkvIPG:A03C
^FO32,576^GFA,32384,32384,00092,:Z64:
eJzt3UGOgjAYxfE2LLrsBSbDRYxezChH4ygcwaULYyXQCs4kxjjfmxn0/xbAgvwgbTGu+pwjhBBCyD9ITIZpbujakk6pm9u2dDrN6GBsz0elTkfLydvMB2V/sKR7fHpV/2Vmf5xwni5Pd+57KtPLRuMh6Qel/X5llelt99a0q66Teb5321PxZQa96eIes8vnynwq+ynM59DZ23UznmNrbxezPMMyocu2Pe2qbK8Fts/rYyuw3VFvCz6d6wsLPh3nVsPRS+xxgZTlYptab7cKOw7HoLGbwW4UdpDbUWO3g62g8wpR2oqf7/LVfEpsj439sK34C1HsFTY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Nvbb2R9Ce6l7AWO/jq3ct3ype7kr97df6p7/yh4EZX/DUjstlD0fyn4Saa/KVmH/QteMsn9H2Ruk7DtS9jSVZ1imjIWyF0vZ56XsIZP2pyl735R9dcqePWU/oLLX0Lqi8qakUtkjqey/lPZ2EvJ3uQAUFu4T:14F4
^FT274,79^A0N,39,48^FH\^FD${guia.m_nFolioGuia}^FS
^FT218,137^A0N,35,33^FH\^FD${guia.m_sCiudadOrigen}^FS
^FT61,137^A0N,35,40^FH\^FDORIGEN:^FS
^FT50,197^A0N,35,45^FH\^FDREMITENTE^FS
^FT61,255^A0N,31,31^FH\^FD${guia.m_sNOmbreRemitente}^FS
^FT61,303^A0N,34,26^FH\^FDTEL:^FS
^FT126,303^A0N,34,26^FH\^FD${guia.m_sTelefonoRemitente}^FS
^FT61,346^A0N,35,26^FH\^FDDIRECCION:^FS
${guia.m_sDomicilioRemitente.length > 30 ?
        (
            guia.m_sDomicilioRemitente.length > 75 ? (
                `^FT209,346^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                ^FT65,390^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(25, 70)}^FS
                ^FT65,444^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(70)}^FS`
            ) : (
                `^FT209,346^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                ^FT65,390^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(25)}^FS`
            )
        ) : `^FT209,346^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente}^FS`}
^FT61,514^A0N,35,33^FH\^FD${guia.m_sSucursalorigen}^FS
^FT53,586^A0N,35,45^FH\^FDDESTINO:^FS
^FT65,644^A0N,31,31^FH\^FD${guia.m_sNombreDestinatario}^FS
^FT65,692^A0N,35,26^FH\^FDTEL:^FS
^FT132,692^A0N,35,26^FH\^FD${guia.m_sTelefonoDestinatario}^FS
^FT65,740^A0N,35,26^FH\^FDDIRECCION:^FS
^FT50,959^A0N,35,33^FH\^FD${guia.m_sSucursalDestino}^FS
^FT282,1135^A0N,20,26^FH\^FD${index + 1} DE ${paquete.rangoFin}^FS
${guia.m_sDomicilioDestinatario.length > 30 ?
        (
            guia.m_sDomicilioDestinatario.length > 75 ? (
                `^FT214,740^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT61,781^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(25, 70)}^FS
                 ^FT61,837^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(70)}^FS`
            ) : (
                `^FT214,740^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT61,781^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(25, 70)}^FS`
            )
        ) : `^FT214,740^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario}^FS`}
^FT292,1016^A0N,20,26^FH\^FDTIPO DE REPARTO^FS
^FT295,1057^A0N,20,26^FH\^FD${guia.tipoEntrega}^FS
^FT61,890^A0N,35,28^FH\^FD${guia.zonaEntrega}^FS
^FT289,1102^A0N,20,26^FH\^FDPARTIDA:^FS
^FT243,586^A0N,35,33^FH\^FD${guia.m_sCiudadDestino}^FS
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

