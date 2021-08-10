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
        downloadOptions: { filename: filename + '.csv', separator: ',' },
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
    noRowsLabel: 'Sin registro',
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
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}-${to} de ${count !== -1 ? count : `more than ${to}`}`,
    nextIconButtonText: 'Siguiente página',
}

export const TICKET_ZABRA_TAMPLATE = "^XA\n" +
    "^MMT\n" +
    "^PW1200\n" +
    "^LL1800\n" +
    "^LS0\n" +
    "^FO40,289^GB1115,0,3^FS\n" +
    "^FT25,92^AAN,36,20^FH\\^FD#Guia:^FS\n" +
    "^FT178,109^A0N,67,67^FH\\^FD000000195^FS\n" +
    "^FT25,340^AAN,36,20^FH\\^FDDestinatario^FS\n" +
    "^FT674,340^AAN,36,20^FH\\^FDRemitente^FS\n" +
    "^FT25,412^A0N,50,50^FH\\^FDCalle las flores #180^FS\n" +
    "^FT25,475^A0N,50,50^FH\\^FDCol. Industrial ^FS\n" +
    "^FT25,538^A0N,50,50^FH\\^FDC.P. 65378^FS\n" +
    "^FT25,601^A0N,50,50^FH\\^FDCiudad, Estado, Pais^FS\n" +
    "^FT674,412^A0N,50,50^FH\\^FDCalle las flores #180^FS\n" +
    "^FT674,475^A0N,50,50^FH\\^FDCol. Industrial ^FS\n" +
    "^FT674,538^A0N,50,50^FH\\^FDC.P. 65378^FS\n" +
    "^FT674,601^A0N,50,50^FH\\^FDCiudad, Estado, Pais^FS\n" +
    "^FO40,638^GB1115,0,3^FS\n" +
    "^FO32,899^GB1115,0,3^FS\n" +
    "^BY5,3,214^FT631,232^BCN,,Y,N\n" +
    "^FD>;123456789012^FS\n" +
    "^FT25,694^AAN,36,20^FH\\^FDJELEM REFRIGERACION COMERCIAL SA DE CV^FS\n" +
    "^FT25,730^AAN,36,20^FH\\^FDJRC171024UG4^FS\n" +
    "^FT25,766^AAN,36,20^FH\\^FDAV. XELHA^FS\n" +
    "^FT25,802^AAN,36,20^FH\\^FDMZA 14 LOTE 9 LOCAL 2^FS\n" +
    "^FT25,838^AAN,36,20^FH\\^FDSM 27 BENITO JUAREZ^FS\n" +
    "^FT25,957^AAN,36,20^FB145,1,0,R^FH\\^FDOrigen^FS\n" +
    "^FT25,1029^A0N,50,50^FH\\^FDMerida ^FS\n" +
    "^FT674,1029^A0N,50,50^FH\\^FDVillahermosa^FS\n" +
    "^FT674,957^AAN,36,20^FB169,1,0,R^FH\\^FDDestino^FS\n" +
    "^FO21,1086^GB1115,0,3^FS\n" +
    "^FT21,1165^AAN,36,20^FH\\^FD#Paquetes:^FS\n" +
    "^FT265,1182^A0N,67,67^FH\\^FD3^FS\n" +
    "^FT25,202^AAN,36,20^FH\\^FDServicio:^FS\n" +
    "^FT244,208^A0N,45,45^FH\\^FDConsolidado^FS\n" +
    "^FT562,1165^AAN,36,20^FH\\^FDPeso:^FS\n" +
    "^FT25,1259^AAN,36,20^FH\\^FDAltura(mts):^FS\n" +
    "^FT562,1259^AAN,36,20^FH\\^FDLargo(mts):^FS\n" +
    "^FT25,1345^AAN,36,20^FH\\^FDAncho(mts):^FS\n" +
    "^FT701,1182^A0N,67,67^FH\\^FD1000 kg^FS\n" +
    "^FT320,1276^A0N,67,67^FH\\^FD0.30^FS\n" +
    "^FT838,1276^A0N,67,67^FH\\^FD0.10^FS\n" +
    "^FT320,1367^A0N,67,67^FH\\^FD0.20^FS\n" +
    "^FO21,1396^GB1115,0,3^FS\n" +
    "^PQ1,0,1,Y^XZ"