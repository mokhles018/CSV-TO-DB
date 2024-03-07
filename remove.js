
import fs from "fs"

// Read the content from title.js
fs.readFile("titles.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Split the content into lines
  const lines = data.split("\n");

  // Filter out non-English lines
  const englishLines = lines.filter((line) => isEnglish(line));

  // Join the filtered lines back into a single string
  const cleanedContent = englishLines.join("\n");

  // Write the cleaned content to cleanTitle.js
  fs.writeFile("cleanTitle.csv", cleanedContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Cleaned content saved to cleanTitle.csv");
    }
  });
});

// Function to check if a line contains English text
function isEnglish(text) {
  // You can implement your own logic to determine if a line is English or not.
  // For a simple check, you can use regular expressions.
  // Here's an example regex pattern to match English text:
  const englishPattern = /^[A-Za-z0-9\s.,!?'"()]*$/;
  return englishPattern.test(text);
}
