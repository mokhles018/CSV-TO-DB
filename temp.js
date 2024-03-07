import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

// Function to extract table data from HTML
function extractTableData(html) {
  const $ = cheerio.load(html);
  const table = $("table.waffle");
  const rows = table.find("tbody > tr");

  // Array to store table data
  const data = [];

  // Loop through each row of the table
  rows.each((index, row) => {
    const rowData = [];
    const cells = $(row).find("td");

    // Extract data from each cell in the row
    cells.each((index, cell) => {
      rowData.push($(cell).text().trim());
    });

    // Add row data to the main data array
    data.push(rowData.join(","));
  });

  return data.join("\n");
}

// Function to save data to a file
function saveToFile(data, filename) {
  fs.writeFileSync(filename, data);
  console.log(`Data saved to ${filename}`);
}

// URL of the Google Sheets HTML view
const url =
  "https://docs.google.com/spreadsheets/d/1OYL3CLBN-yTV9YYAMLllKYYmqOa3jpAMqceFkgY7ch0/htmlview";

// Fetch the HTML content
axios
  .get(url)
  .then((response) => {
    // Extract table data from HTML
    const tableData = extractTableData(response.data);

    // Save data to a file
    saveToFile(tableData, "table_data.csv");
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
