import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

function ExportCSV ({csvData, fileName}) {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xls';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <a data-toggle="tab" onClick={(e) =>
            exportToCSV(csvData,fileName)
        } href="#ExportarXLS">
            <i className="zmdi zmdi-print"/>
            Exportar
        </a>
    )
}

export default ExportCSV