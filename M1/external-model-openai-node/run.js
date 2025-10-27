import OpenAI from "openai";
import 'dotenv/config'; // Loads variables from the .env file
import chalk from "chalk"; // Package for colored terminal output

// Constants for chalk colors
const ERROR = chalk.red;
const SECTION = chalk.cyan;
const ITEM = chalk.yellow;
const NORMAL = chalk.white; // Or just use console.log without chalk for default color

// Check if the API key is set
if (!process.env.OPENAI_API_KEY) {
    console.error(ERROR("ERROR: API Key was not found!"));
    console.error(ERROR("Ensure that the .env file exists and contains the OPENAI_API_KEY variable."));
    process.exit(1);
} else {
  console.log(`${ITEM("env var OPENAI_API_KEY")}: ${process.env.OPENAI_API_KEY.slice(0, 4)}...${process.env.OPENAI_API_KEY.slice(-4)}`);
}

const openai = new OpenAI();

async function run() {
  // const model = "gpt-3.5-turbo-0125";
  // const model = "gpt-4"
  // const model = "gpt-o4"
  // const model = "gpt-4o"
  const model = "gpt-4-turbo"
  const promptContent = "Jakie jest najszybsze zwierzę na Ziemi?"; // Prompt content

  console.log(`${ITEM("model")}: ${model}`);

  try {
    // API call to create a chat completion
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: promptContent,
        },
      ],
      max_completion_tokens: 128,
    });

    const responseText = completion.choices[0].message.content.trim();
    const usage = completion.usage;

    console.log(SECTION("--- Conversation ---"));
    console.log(`${ITEM(`User`)}: "${promptContent}"`);
    console.log(`${ITEM(`Model: `)}"${responseText}"`);
    console.log(SECTION("--- Usage Statistics ---"));
    console.log(NORMAL(`Prompt tokens (input): ${usage.prompt_tokens}`));
    console.log(NORMAL(`Completion tokens (output): ${usage.completion_tokens}`));
    console.log(NORMAL(`Total tokens: ${usage.total_tokens}`));
    console.log(NORMAL(`Success: Connection and API call are working correctly! 🎉`));

  } catch (error) {
    // Handling API errors
    console.error(ERROR("\n--- API ERROR ---"));
    console.error(ERROR(error.message)); 
    console.log(ERROR("An error occurred. Check the status of your API key and payment plan."));
  }
}

run();