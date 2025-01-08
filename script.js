import ollama from "ollama";
import fs from "fs";
import path from "path";


const inputFolder = "./input";
const outputFolder = "./output";


const files = fs.readdirSync(inputFolder).filter(file => path.extname(file) === ".txt");

askQuestions();

async function askQuestions() {
  for (const file of files) {
    try {
 
      const question = fs.readFileSync(path.join(inputFolder, file), "utf-8");

      const response = await ollama.chat({
        model: "llama3.2:1b",
        messages: [{ role: "user", content: question }]
      });

      const outputFile = path.join(outputFolder, file);
      fs.writeFileSync(outputFile, response.message.content);

      console.log(`Answer saved to ${outputFile}`);
    } catch (error) {
      console.error(`Error processing ${file}:, error.message`);
    }
  }
}