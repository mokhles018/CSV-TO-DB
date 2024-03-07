
import axios from "axios"
import xml2js from "xml2js"

const url = "https://www.saasworthy.com/sitemaps/product_sitemap_google.xml";

axios
  .get(url)
  .then((response) => {
    if (response.status === 200) {
      const xmlData = response.data;

      // Parse XML data
      xml2js.parseString(xmlData, (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err);
          return;
        }

        // Extract the "product" part from each URL
        const urls = result.urlset.url;
        if (Array.isArray(urls)) {
          urls.forEach((urlElement) => {
        const loc = urlElement.loc[0];
        const urlParts = loc.split("/");
        if (urlParts.length > 0) {
          const lastPart = urlParts[urlParts.length - 1];
          console.log("Last part of the URL:", lastPart);
        } else {
          console.log("URL is empty:", loc);
        }
          });
        } else {
          console.log("No URLs found in XML.");
        }
      });
    } else {
      console.error("Failed to retrieve XML data. Status:", response.status);
    }
  })
  .catch((error) => {
    console.error("Error fetching XML:", error);
  });