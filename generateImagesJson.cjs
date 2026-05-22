// generateImagesJson.cjs
const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "public/images");
const outputPath = path.join(__dirname, "public/images.json");

try {
  const files = fs
    .readdirSync(folderPath)
    .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  fs.writeFileSync(outputPath, JSON.stringify(files, null, 2));
  console.log(`✅ Created images.json with ${files.length} files`);
} catch (err) {
  console.error("❌ Error generating images.json:", err);
}
