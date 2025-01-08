import ollama from "ollama";
import fs from "fs";
import path from "path";

const questionsDir = "./question";
const answersDir = "./answers";


if (!fs.existsSync(answersDir)) {
  fs.mkdirSync(answersDir);
}

const category = process.argv[2];
if (!category) {
  console.error("Please specify a category (e.g., Academic, Professional, Creative).");
  process.exit(1);
}

const categoryPath = path.join(questionsDir, category);
if (!fs.existsSync(categoryPath)) {
  console.error(`Category "${category}" does not exist in the questions directory.`);
  process.exit(1);
}


const files = fs.readdirSync(categoryPath).filter(file => path.extname(file) === ".txt");
if (files.length === 0) {
  console.error(`No questions found in the "${category}" category.`);
  process.exit(1);
}


const randomFile = files[Math.floor(Math.random() * files.length)];
const questionPath = path.join(categoryPath, randomFile);

(async function processQuestion() {
  try {
    console.log(`Selected question file: ${randomFile}`);

    // Read the content of the selected question file
    const question = fs.readFileSync(questionPath, "utf-8");
    console.log(`Question content:\n${question}`);

    // Query the Ollama model
    const response = await ollama.chat({
      model: "llama3.2:1b",
      messages: [{ role: "user", content: question }],
    });

    // Extract the response content
    const answer = response?.message?.content || "No answer received";
    console.log(`Generated Answer:\n${answer}`);

    // Create a category-specific subdirectory in the answers folder
    const categoryAnswersDir = path.join(answersDir, category);
    if (!fs.existsSync(categoryAnswersDir)) {
      fs.mkdirSync(categoryAnswersDir);
    }

    // Save the answer to a file in the answers directory
    const outputFileName = `a${path.basename(randomFile, ".txt")}.txt`;
    const outputPath = path.join(categoryAnswersDir, outputFileName);
    fs.writeFileSync(outputPath, answer);

    console.log(`Answer saved to: ${outputPath}`);
  } catch (error) {
    console.error("Error processing the question:", error.message);
  }
})();
