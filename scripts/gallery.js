const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const author = "gorun";
const imagePath = path.resolve(__dirname, `../foto/${author}`);
const versionCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

console.log(
  "Prepare JSON format for https://www.npmjs.com/package/react-photo-gallery-next"
);

const processImages = async () => {
  try {
    const photos = fs
      .readdirSync(imagePath)
      .filter((photo) => photo.toLowerCase().endsWith(".webp"))
      .sort((a, b) => versionCollator.compare(a, b));

    const array = (
      await Promise.all(
        photos.map(async (p) => {
          try {
            const info = await sharp(path.join(imagePath, p)).metadata();
            const isLandscape = info.width > info.height;

            return {
              src: `https://foto2026.diecezko.cz/foto/${author}/${p}`,
              original: `https://foto2026.diecezko.cz/foto/${author}/${p}`,
              width: isLandscape ? 4 : 3,
              height: isLandscape ? 3 : 4,
              alt: "Fotka z jarního Diecézka 2026",
              caption: "Fotka z jarního Diecézka 2026",
            };
          } catch (err) {
            console.error(`Error processing image ${p}:`, err);
            return null;
          }
        })
      )
    ).filter(Boolean);

    // Write array into the file
    fs.writeFileSync(path.join(imagePath, "images.json"), JSON.stringify(array));

    console.log("Processing completed successfully.");
  } catch (err) {
    console.error("Error reading directory:", err);
  }
};

// Call the function to start processing
processImages();
