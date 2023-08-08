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
^PW815
^LL1295
^LS0
^FO32,224^GFA,29440,29440,00092,:Z64:
eJzt3UtugzAUhWFbDBh6B2UjVbKtDKripXkpXkKGDKq6LcYE1Ieq6J5GUf8zwQP0KboYlNGxc4QQQgghhJAvUgwz7WRvSZfyurWDrV3Sxh6N7Wk3kmj47LrtUPpiKM94XNfD9P19V2XMl2UytsPlxxqP5H0oL59XZll/bX82t49xWYRsbg+pLeIPd12XPi+LozntujbmZ3vbt01ov01W01u/lR9ZZtHZb8H1GXZZYA/10ieBHWK1o8Be0CCxU7UFtOuqPUjsPF8OCtuf5fajwnbVfpLY9UNyktgnua34DLZJKz6DbYcIba+x57fGZ4n9gI39W1vyF6LZCRsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxv7NrZX2hkb+8a2sBvrXvvCpB1q99orp+zaU3YEHhT0H/QmKrsklR2Yyu5OZeeositV2fGq7KZVduoqu4ClHcbK7mVlZ7Sy61rZ0a3sFld2oku73JUd9MrufONjEPYHIYzG9nbGyjMWlGdDEELIP84bdQOLRg==:EED1
^FO32,640^GFA,32384,32384,00092,:Z64:
eJzt3UGOgjAYxfE2LLrsBSbDRcx4MaMcjaNwhFm6MFYCraAmxDjfmwT9vwWwID+athBXPufImyUmwzQ3dG1Jp9TNbVs6nWZ0MLbns1Kno+XibeeTcvi1pHt8Gqq/W9k/J5yny9PCfS9lGmw0npJ+UtrHK6tMoz1Y0666LuZ56baX4ssKetPNPWafz5X5UvZLmM+hs7frZjzH1t4uZnmGZUKXbXvaVdn+Edg+74+dwHZHvS14da4DFrw6zm2Go5fY4wYp28U2td5uFXYcjkFjN4PdKOwgt6PGbgdbQecdorQVn+/y1nxLbI+N/bSt+AlR7A02NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb2x9tfQnut/xOP/T62stNirT0fyu6TtfbBKDtylN0+a+07UnZAKburpJ1bO4X9Dz1kym42ZaecsgtP2eFXnmGZMhfKzkRl16Oyo1LaransBFV2mSo7WJXdscrOW+v64psCY2XHsLIbWdrpTMhyLiQvAQ8=:AAD3
^FT274,79^A0N,39,48^FH\^FD${guia.m_nFolioGuia}^FS
^FT218,161^A0N,35,33^FH\^FD${guia.m_sCiudadOrigen}^FS
^FT61,161^A0N,35,40^FH\^FDORIGEN:^FS
^FT50,245^A0N,35,45^FH\^FDREMITENTE^FS
^FT61,303^A0N,31,28^FH\^FD${guia.m_sNOmbreRemitente}^FS
^FT61,359^A0N,35,45^FH\^FDTEL:^FS
^FT150,359^A0N,35,40^FH\^FD${guia.m_sTelefonoRemitente}^FS
^FT61,416^A0N,35,45^FH\^FDDIRECCI\E3N:^FS
${guia.m_sDomicilioRemitente.length > 30 ?
        (
            guia.m_sDomicilioRemitente.length > 75 ? (
                `^FT303,416^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
        ^FT65,460^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(25, 70)}^FS
        ^FT65,514^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(70)}^FS`
            ) : (
                `^FT303,416^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
            ^FT65,460^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(25)}^FS`
            )
        ) : `^FT303,416^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente}^FS`}
^FT61,566^A0N,35,45^FH\^FD${guia.m_sSucursalorigen}^FS
^FT53,634^A0N,35,45^FH\^FDDESTINO:^FS
^FT65,692^A0N,31,31^FH\^FD${guia.m_sNombreDestinatario}^FS
^FT65,748^A0N,35,45^FH\^FDTEL:^FS
^FT154,748^A0N,35,38^FH\^FD${guia.m_sTelefonoDestinatario}^FS
^FT65,804^A0N,35,45^FH\^FDDIRECCI\E3N:^FS
^FT50,1031^A0N,35,45^FH\^FD${guia.m_sSucursalDestino}^FS
^FT292,1240^A0N,45,14^FH\^FD${index + 1} DE ${paquete.ctd}^FS
^FT500,1282^BQN,2,7
^FH\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
${guia.m_sDomicilioDestinatario.length > 30 ?
        (
            guia.m_sDomicilioDestinatario.length > 72 ? (
                `^FT303,804^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
            ^FT61,854^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(25,70)}^FS
            ^FT61,910^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(70)}^FS`
            ) : (
                `^FT303,804^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
            ^FT61,854^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(25)}^FS`
            )
        ) : `^FT303,804^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario}}^FS`
    }
^FT292,1082^A0N,20,26^FH\^FDTIPO DE REPARTO^FS
^FT303,1125^A0N,25,19^FH\^FD${guia.tipoEntrega}^FS
^FT61,963^A0N,35,28^FH\^FD${guia.zonaEntrega}^FS
^FT50,1291^BQN,2,7
^FH\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
^FT289,1191^A0N,20,26^FH\^FDPARTIDA:^FS
^PQ1,0,1,Y^XZ`)


export const TOOLBAR_OPTIONS = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
    inline: {inDropdown: true},
    list: {inDropdown: true},
    textAlign: {inDropdown: true},
    link: {inDropdown: true},
    history: {inDropdown: true},
};

