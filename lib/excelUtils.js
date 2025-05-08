import * as XLSX from 'xlsx';

export const extractDataFromExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assumindo que os dados estão na primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Extrair dados da segunda linha (índice 1) se existir
        const secondRowData = jsonData[1] || [];
        resolve(secondRowData);

        // Implementar lógica para extrair imagens aqui (mais complexo)
        // Você precisará analisar a estrutura interna do arquivo .xlsx
        // para encontrar as imagens e suas localizações.
        // A biblioteca 'xlsx' oferece algumas funcionalidades para isso,
        // mas pode exigir um tratamento mais específico.
        // Veja a documentação da 'xlsx' sobre 'embedded images'.

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

// Função para extrair imagens (pode ser mais complexa e depender da estrutura do 'xlsx')
export const extractImagesFromExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const images = [];

        // Percorrer as relações para encontrar as imagens
        if (workbook.vbaProject && workbook.vbaProject.zip) {
          const zip = workbook.vbaProject.zip;
          zip.forEach(function (relativePath, zipEntry) {
            if (relativePath.startsWith('xl/media/')) {
              images.push({
                name: relativePath.split('/').pop(),
                data: zipEntry.async('nodebuffer'),
              });
            }
          });
        }

        resolve(images);

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};