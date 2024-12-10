import React from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";

function ExportPDF({data, column, fileName}){

    const exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        const columnNames = [];

        doc.setFontSize(15);
        const title = fileName;

        let content = {
            startY: 50,
            head: columnNames,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save(fileName)
    }

    return (
        <a data-toggle="tab" onClick={(e) => exportPDF(data, column, fileName)} href="#ExportarPDF">
            <i className="zmdi zmdi-print"/>
            Exportar PDF
        </a>
    );
}

export default ExportPDF;