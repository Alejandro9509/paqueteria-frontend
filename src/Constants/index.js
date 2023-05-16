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

export const TICKET_ZABRA_TAMPLATE = (guia, paquete, index) => (
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

export const TICKET_ZABRA_TAMPLATE_PLATEROS = (guia, paquete, index) => (
    `^XA
    ^CI28
    
    
    ^FO10,1^GFA,6912,6912,48,,:::::::::::::::::::::::::::::W03C,W062,W0436,V07C1F8,V0CC108,T07F13804,S0FF91I07E,Q01FC010E0247E06,Q0F80010336403E4,P03CI0707FC8007C,O01E003FE3879CI0F,O07003FE3C01EFE03DC,N01C01FF8FI070FE7C6,N0180F0E38J0FC7C22,N0183C0DEL081832,N018E006I0F80301832,N01980038078F8E01822,N019J0FF800F807862,N019J066I0880C0C2T02,N019J0426088C18042T03C,N019J042F3E8C10062T03F8,N019J062I08C30022Q07803FFC,N019J092I09230032P0FF803JF,N019I01120C0923003203KFC01FF803KFC3NF1LF87LFJ01IFK0KFE,N019I01F20011F3002203LF01FF803KFE3NF1LF87LFCI07IFEI07KFE,N019I03110E1019002203LFC1FF803KFE1NF1LF87MF001KFI0LFE,N019I0203803009806203LFE1FF803KFE1NF1LF87MF003KF801LFE,N019I0406C04C08C0C203MF1FF803LF1NF1LF87MF807KFC03LFE,N019I060C3386087F8203MF1FF800LF0NF1LF87MFC0LFE07LFE,N019I02180E03083E3203MF1FF8001KF0NF1LF87MFC0MF0MFE,N019I033J0110203203MF1FF8I03JF8NF1LF87MFC1MF0MFE,K03F1WFE007F800FF1FEJ03JF8I07FC001FF00FF80FFI03FC1MF8MFE,K01YFE007F8007F1FEJ03FEFF8I03FC001FF007F80FFI03FC3FF803FF87F8001FE,L0YFE007F8007F1FEJ07FEFFCI03FC001FF007F80FFI01FC3FFI0FFC7FI01FE,L07XFE007F8007F1FEJ07FC7FCI03FC001FF007F80FFI01FC3FEI0FFC7FI01FE,L03XFE007F8007F1FEJ07FC7FCI03FC001FF007F80FFI01FC3FEI07FC7FI01FE,L03XFE007F8007F1FEJ0FFC7FEI03FC001FF007F80FFI03FC3FCI07FC7F8,L01XFE007F800FF1FEJ0FF83FEI03FC001FFL0FFI03FC3FCI07FC7FE,L01XFE007LF1FEJ0FF83FFI03FC001IFCJ0MFC3FCI07FC7IFC,L07XFE007LF1FEI01FF83FFI03FC001IFCJ0MFC3FCI07FC7KF,L0YFE007LF1FEI01FF01FFI03FC001IFCJ0MF83FCI07FC7KFE,K01YFE007LF1FEI01FF01FF8003FC001IFCJ0MF83FCI07FC7LF8,K03YFE007KFE1FEI03LF8003FC001IFCJ0MF03FCI07FC3LFC,K01YFE007KFC1FEI03LF8003FC001IFCJ0LFE03FCI07FC0LFE,L0YFE007KF81FEI07LFC003FC001IFCJ0LFC03FCI07FC03KFE,L07XFE007JFE01FEI07LFC003FC001IFCJ0LF003FCI07FC003KF,L03XFE007F8J01FEI07LFC003FC001FFL0FF07FC003FEI07FCJ03IF,L01XFE007F8J01FEI0MFE003FC001FE007F80FF07FE003FEI0FFCK03FF,L01XFE007F8J01FEI0MFE003FC001FF007F80FF03FE003FFI0FFCK01FF,L03XFE007F8J01FEI0MFE003FC001FF007F80FF03FF003FF801FF8K01FF,L07XFE007F8J01FE001FF8003FF003FC001FF007F80FF01FF001MF8K01FF,L0YFE007F8J01FE001FFI03FF003FC001FF007F80FF01FF801MF8K01FF,K01YFE007F8J01FE003FFI01FF003FC001FF00FF80FF01FF800MFJ07JF,K01IFCKFC03C03FC06403IF8I0IFE01FFE00IFE3IF87MF87FF07IF00LFE00MF,L03FE4007EE00E00FFC04403IF8I0JFC0FFE00IFE3IF87MF87FF0JFE07KFC07LFE,O04003F8070073F80CC03IF8I0KF07FE00IFE3IF87MF87FF0KF83KFC1MFE,O06601E0380382F00CC03IF8I0KF83FE00IFE3IF87MF87FF0KFC1KF03MFC,O06600E1C01C03E008803IF8I0KFC1FE00IFE3IF87MF87FF0KFE07IFE0NFC,O022006E00E00EC019803IF8I0LF07E00IFE3IF87MF87FF0LF01IF81NF8,O0330078070076C011003IF8I0LF8J0IFE3IF87MF87FF0LFCK03MFE,O01100603803858033003IF8I0LFCJ0IFE3IF87MF87FF0LFEK07MF,O0198061C01C058023R01JFgN01JFJ01JF,P08C07E00E00FC066S03JFEgM01IFEI0JF,P0C4070070079C0C4T0JFEgN07JF0JFE,P06607038038BC08CT03IFEgN03JF0JF8,P063079C01C1BC198T01IFEgO0JF0JF,P031807FCE01E0318U0IFE00IF3F038180FC3879C40380FC007IF0IFE,P018C0207FC72063V03FFE00IF3FC381C3FE78F1C60383FF003IF0IF8,Q0C607F647FC0C6V01FFE00IF3FE381C7FE78E1C78387FFI0IF0IF,Q043062C604418CW07FEI0F038E381C78639E1C7C38783I03FF0FF8,Q06186F83FC0318gI0F038E381CF007BC1C7E38F,Q030C57014C0E3gJ0F038E381CE007F81C7F38E,Q01873C01DC186gJ0F039C381CE007F01C7FB8E1F,R0E18I0D470CgJ0F03FC381CE003F01C77F8E3F,R030EI038C18gJ0F03F8381CE007F81C73F8E3F,R01838I0387gK0F03B83838F007BC1C70F8F07,S0E0E001E0CgK0F03BC3C38F0279E1C7078F07,S0303C07838gK0F039E1E787FE38F1C70387C7,S01C07BC0EgL0F038F1FF03FE78F1C70183FF,T0700E03CgL0F078F0FE01FE7879C78081FF,T01EI0FgS038003Q038,U078038,V0F1E,V01F,,:::::::::::::::::::::::::::::^FS
    
    
    ^CF0,40
    ^FO390,60^FD${guia.m_nFolioGuia}^FS
    ^CF0,30
    ^FO50,150^FDORIGEN:^FS
    ^FO200,150^FD${guia.m_sCiudadOrigen}^FS
    
    ^FO50,200^FDREMITENTE:^FS
    
    ^FO50,250^GB700,250,3^FS
    ^CF0,30
    ^FO55,260^FD${guia.m_sNombreRemitente}^FS
    ^FO55,300^FDTEL:^FS
    ^FO120,300^FD${guia.m_sTelefonoRemitente}^FS
    ^FO55,340^FDDIRECCIÓN:^FS
    ^FO220,340^FD${guia.m_sDomicilioRemitente}^FS
    ^FO55,440^FD${guia.m_sCiudadOrigen}^FS
    
    ^FO50,520^FDDESTINO:^FS
    
    ^FO50,570^GB700,250,3^FS
    ^CF0,30
    ^FO55,590^FD${guia.m_sNombreDestinatario}^FS
    ^FO55,630^FDTel:^FS
    ^FO120,630^FD${guia.m_sTelefonoDestinatario}^FS
    ^FO55,670^FDDIRECCIÓN:^FS
    ^FO220,670^FD${guia.m_sDomicilioDestinatario}^FS
    ^FO55,770^FD${guia.m_sCiudadDestino}^FS
    
    
    ^FO200,900^FD${index + 1} DE ${paquete.ctd}^FS
    
    ^MUm
    ^FO70,105
    ^BQN,2,5
    ^FH^FDLA,${guia.m_nIdGuia}-${paquete.m_nIdEmbarqueDetalle}-${index}^FS
    
    
    
    ^XZ`)


export const TOOLBAR_OPTIONS = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: true },
};

