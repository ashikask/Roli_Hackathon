#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { ServiceOptions } from "roli-client";
import { createRoliClient, GatewayApi } from "gateway-service";

const roli = createRoliClient(new ServiceOptions(false, false));
const gatewayApi = roli.getEndpoint(GatewayApi, "default");

(async () => {
  const { userName } = await inquirer.prompt({
    type: "input",
    name: "userName",
    message: "Login: ",
  });

  console.log(`Hello, ${userName}. You are speaking with a chatbot.`);
  const session = await gatewayApi.getSession(userName);

  let continueSession = true;
  let hasTranscript = false;

  while (continueSession) {
    const message = hasTranscript
      ? `${userName}, ask a question about the video or type /quit to exit:`
      : `${userName}, please provide a YouTube URL to analyze, or type /quit to exit:`;

    const { userInput } = await inquirer.prompt({
      type: "input",
      name: "userInput",
      message,
      validate: (input) => {
        return (
          input.toLowerCase() === "/quit" ||
          hasTranscript ||
          /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(input) ||
          "Please enter a valid YouTube URL, ask a question about the video, or type /quit to exit."
        );
      },
    });

    if (userInput.toLowerCase() === "/quit") {
      continueSession = false;
      console.log("Thank you for using our service. Goodbye!");
    } else {
      const response = await session.tell(userInput);

      if (!hasTranscript) {
        // Assume that if we don't have a transcript, the response is about processing the YouTube URL.
        console.log(chalk.greenBright(response));
        hasTranscript = true;
      } else {
        // If we do have a transcript, the response is an answer to the video question.
        const timestamp = chalk.grey(`[${new Date().toLocaleTimeString()}]`);
        const botName = chalk.whiteBright("[chatbot]:");
        const reply = chalk.greenBright(response);
        console.log(`${timestamp} ${botName} ${reply}`);
      }
    }
  }
})().catch((e) => {
  console.error("Unexpected failure:", e);
});
