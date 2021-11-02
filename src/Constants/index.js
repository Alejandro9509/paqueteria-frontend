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

export const TICKET_ZABRA_TAMPLATE = (guia, paquete, index) => (

    /*`^XA
^CI28
^MUm
^LL150,^PW100^LH0,0
^FO2,7
^BQN,2,7
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
^XZ`*/

`^XA
^FO150,240^GFA,1190,1190,7,,::::::::01I01,03E003F8,03FC03IF,03FE03JFC,03FE03KF,03FE03KF8,07FE03KF8,07FC03KF8,07FC03KFC,::::07FC03F80FFC,07FC03F807FC,07FC03F803FE,07FC01F803FE,07FC003803FE,07FCK03FE,07FEK07FE,03FEK07FE,:03FFK07FC,03FF8J0FFC,01FF8J0FFC,01FFCI01FFC,01FFEI01FFC,00IF8007FFC,00IFE00IF8,007NF8,:003NF,073NF,07NFE,07NFC,07NF8,:07OF8,07OFC,::::07FFBLFC,07FF80KF8,07IF003IF8,07IFCI0FF8,03JFJ038,007IFC,001IFE,I07IF8,I01IFE,J03IF8,K0IFE,K03IFC,L0JF,L03IFC,M0JF,M07IF8,L07JF8,03OF8,07OF8,::::07NF,07JFC,07FF8,07FFE,07IFE,07JFE,07KFE,07MF,07NF,03OF8,003NFC,I03MFC,I01IF1IFC,I01F9E07FFC,I01F1C07FFC,I01F3CE3FFC,I01F3CF3FFC,I01F39F3BFC,I01F01F381C,I01F83E38,I01FC3E78,I01IF0F8,I01F9E078,I01F1C078,I01F3CF38,:I01F39F38,I01F01F38,I01F83E38,I01FC7E78,I01F3FF38,I01F3DF38,::::I01FI038,:I01KF8,I01JF38,I01FC3838,I01F80078,I01F1C3F8,I01F3CFF8,:I01F34E78,I01FI038,:I01KF8,I01FE3FF8,I01F81FF8,I01F00FF8,I01F1CFF8,I01F3C7F8,:I01FI038,:I01F800F8,I01KF8,I01F3FE38,I01F0F838,I01F820F8,I01FE03F8,I01FF87F8,I01FE03F8,I01F830F8,I01F0FC38,I01F3FF38,I01KF8,I01F3FF38,I01F3DF38,:::I01FI038,:I01FI078,I01KF8,:::I01FF9FF8,I01FF07F8,I01FC01F8,I01FI078,I01CI038,I01K08,,:::::::^FS

^CI28
^MUm
^FO2,0
^BQN,2,7
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


