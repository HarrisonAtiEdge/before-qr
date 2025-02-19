const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

// Load the Excel file
const excelFilePath = "All Drawing Master Sheet.xlsx"; // Adjust if needed
const workbook = xlsx.readFile(excelFilePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Extract "Drawing Code" column values
const data = xlsx.utils.sheet_to_json(sheet);
const modelNumbers = data.map(row => row["Drawing Code"]).filter(code => code); // Ensure valid values

// Define image categories
const categories = ["category1", "category2", "category3"];
const baseImagePath = "cars/";
let cars = [];
let id = 1;

// Read images from each category folder
categories.forEach(category => {
  const categoryPath = path.join(baseImagePath, category);

  if (fs.existsSync(categoryPath)) {
    const imageFiles = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith(".png") || file.endsWith(".jpg"))
      .sort(); // Sort to maintain order

    imageFiles.forEach(image => {
      if (modelNumbers.length === 0) return; // Ensure we don't exceed available model numbers

      cars.push({
        id: id++,
        category: category,
        image: `${categoryPath}/${image}`,
        model_no: modelNumbers.shift(), // Assign Drawing Code as model_no
        rating_uniqueness: null,
        rating_art_concept: null,
        rating_message: null
      });
    });
  } else {
    console.log(`❌ Warning: Folder '${category}' not found.`);
  }
});

// Write to JSON file
fs.writeFileSync("cars.json", JSON.stringify(cars, null, 2));
console.log("✅ cars.json created successfully!");
