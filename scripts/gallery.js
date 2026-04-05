const fs = require("fs");
const sharp = require("sharp");

// const image_path_gorun = "../foto/gorun";
// const image_path_urban = "../foto/urban";

const author = "urban";
const image_path_urban = `../foto/${author}`;

console.log(
  "Prepare JSON format for https://www.npmjs.com/package/react-photo-gallery-next"
);

const processImages = async () => {
  let array = [];

  try {
    const photos = fs.readdirSync(image_path_urban);

    // Process images sequentially
    await Promise.all(
      photos.map(async (p) => {
        let width, height;

        try {
          const info = await sharp(`${image_path_urban}/${p}`).metadata();

          width = info.width > info.height ? 4 : 3;
          height = info.width > info.height ? 3 : 4;

          if (p.includes(".webp"))
            array.push({
              src: `https://foto2026.diecezko.cz/foto/${author}/${p}`,
              original: `https://foto2026.diecezko.cz/foto/${author}/${p}`,
              width: width,
              height: height,
              alt: "Fotka z jarního Diecézka 2026",
              caption: "Fotka z jarního Diecézka 2026",
            });
        } catch (err) {
          console.error(`Error processing image ${p}:`, err);
        }
      })
    );

    // Write array into the file
    const file = fs.createWriteStream(`${image_path_urban}/images.json`);
    file.write(JSON.stringify(array));
    file.end();

    console.log("Processing completed successfully.");
  } catch (err) {
    console.error("Error reading directory:", err);
  }
};

// Call the function to start processing
processImages();
