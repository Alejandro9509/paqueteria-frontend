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
^PW799
^LL1199
^LS0
^FO32,192^GFA,29440,29440,00092,:Z64:
eJzt3T1ug0AURWFGFJTsIGwksrflIopZGkuZJbikiEIS82NQlCiy3omFdG7DFOiT9RiQqztFYYwxBs4QmH4jp0h6GN7Xdh1rD93KPgfb/WYkbeCzK9dDqYZA+Yq3y7rpf77vrpzzbdkF2/XtxwaP5HMob99XYVl+bXUJt4/ttKhzuN1086L95a77UuVpcQyni3Ie82u8neZNGL9NFjNFv5VfmWZRxm/B5RmWGbCb8VJ1gF23o90C9oTWiN2NNkAX5Wg3iJ2vlwNhpwtuPxN2MdoviD1+SE6IfcJt4jM4T5r4DM47BLQTY1/fmpQR+0lb+6828hditjttbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1t7cfYibSztvaDbbAba699YWiH2l575ciuPbIj8EDQ/9CbSHZJkh2YZHcn2TlKdqWSHa9kNy3ZqUt2AaMdxmT3MtkZTXZdkx3dZLc42YmOdrmTHfRkd37wMQjbgxDOwfZ6xuQZC+TZEMYYY4wxxuwsH3Cyi0Y=:AF11
^FO32,576^GFA,35328,35328,00092,:Z64:
eJzs3TFuwjAYxXFbGTz6AlVzEQQXQ5Cj5Sg5QkcGhIkSm7ithCr6vaqB/xuSDNEvlu1ETDznCCGEEPIPEpNhuk90a0mnNNS2LZ3OFR2M7XpW2nSyXLxdPSnHD0t6xJeh+i8r++uEy3J5vnPfQ1kGG42nZJyU/vuVVZbRHq1p19wW83Lvtofiywp6080955DPjflSjkuYz2Gwt9tuPsfe3i5meYZlwpBte9o12d4KbJ/3x15gu5PeFrw6twELXh3nNtPRS+x5g5TtYptWb/cKO07HoLG7ye4UdpDbUWP3k62g8w5R2orPd3lr3iW2x8b+sa34CVHsDTY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NvbL229Ce63/E4/9PLay02KtPR/K7pO19sEoO3KU3T5r7TtSdkApu6uknVt7hf0HPWTKbjZlp5yyC0/Z4VeeYZkyF8rORGXXo7KjUtqtqewEVXaZKjtY6+7YKwAAAP//owpCujuWlnfeUvv6YpQLjGl5xzAt70am6Z3Oo2AUjIJRMApGwSgYjgAAQIkBDw==:9BF3
^FT274,79^A0N,39,48^FH\^FD${guia.m_nFolioGuia}^FS
^FT218,137^A0N,35,33^FH\^FD${guia.m_sCiudadOrigen}^FS
^FT61,137^A0N,35,40^FH\^FDORIGEN:^FS
^FT50,197^A0N,35,45^FH\^FDREMITENTE^FS
^FT61,255^A0N,31,31^FH\^FD${guia.m_sNombreRemitente}^FS
^FT61,311^A0N,34,26^FH\^FDTEL:^FS
^FT126,311^A0N,34,26^FH\^FD${guia.m_sTelefonoRemitente}^FS
^FT61,368^A0N,35,26^FH\^FDDIRECCIÓN:^FS
${guia.m_sDomicilioRemitente.length > 30 ?
        (
            guia.m_sDomicilioRemitente.length > 75 ? (
                `^FT209,368^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                 ^FT65,412^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(25, 70)}^FS
                 ^FT65,466^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(70)}^FS`
            ) : (
                `^FT209,368^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(0, 25)}^FS
                 ^FT65,412^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente.substring(25)}^FS`
            )
        ) : `^FT209,368^A0N,35,28^FH\^FD${guia.m_sDomicilioRemitente}^FS`}
^FT61,518^A0N,35,33^FH\^FD${guia.m_sSucursalorigen}^FS
^FT53,586^A0N,35,45^FH\^FDDESTINO:^FS
^FT65,644^A0N,31,31^FH\^FD${guia.m_sNombreDestinatario}^FS
^FT65,700^A0N,35,26^FH\^FDTEL:^FS
^FT132,700^A0N,35,26^FH\^FD${guia.m_sTelefonoDestinatario}^FS
^FT65,757^A0N,35,26^FH\^FDDIRECCION:^FS
^FT50,974^A0N,35,33^FH\^FD${guia.m_sSucursalDestino}^FS
^FT292,1151^A0N,45,14^FH\^FD${index + 1} DE ${paquete.ctd}^FS
^FT517,1196^BQN,2,6
^FH\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
${guia.m_sDomicilioDestinatario.length > 30 ?
        (
            guia.m_sDomicilioDestinatario.length > 75 ? (
                `^FT214,757^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT61,806^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(25, 70)}^FS
                 ^FT61,862^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(70)}^FS`
            ) : (
                `^FT214,757^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(0, 25)}^FS
                 ^FT61,806^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario.substring(25)}^FS`
            )
        ) : `^FT214,757^A0N,35,28^FH\^FD${guia.m_sDomicilioDestinatario}^FS`}
^FT292,1016^A0N,20,26^FH\^FDTIPO DE REPARTO^FS
^FT295,1060^A0N,28,24^FH\^FD${guia.tipoEntrega}^FS
^FT61,915^A0N,35,28^FH\^FD${guia.zonaEntrega}^FS
^FT61,1203^BQN,2,6
^FH\^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
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

