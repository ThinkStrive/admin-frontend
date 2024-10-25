import React from 'react';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { primaryColorButton, primaryColorButtonHover } from '../../Styles/Color';

const ExcelExportButton = ({ data, filename }) => {
  const handleDownloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');


    const headers = Object.keys(data[0] || {}).map(key => ({
      header: key,
      key: key,
      // width: key.length
    }));
    sheet.columns = headers;


    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00FF00' } 
      };
    });

    // Add data rows
    data.forEach((item) => {
      sheet.addRow(item);
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), filename || 'download.xlsx');
    });
  };

  return (
    <i class={`fa-solid fa-file-arrow-down text-2xl ${primaryColorButton} ${primaryColorButtonHover} px-4 py-2 rounded `} onClick={handleDownloadExcel} ></i>
  );
};

export default ExcelExportButton;
