import { exec } from "child_process";
import fs, { createReadStream } from "fs";
import archiver from "archiver";
import axios from "axios";
import FormData from "form-data";

// Define your environment variables correctly
const TOKEN: string | undefined = '6517364983:AAH9X6ThZBE9QbCaC_XLID2BcPEpp4dRTZw';
const CHAT_ID: string | undefined = '-1002104407545';
const MONGO_URI: string | undefined = 'mongodb://localhost/servers';
const BACKUP_PATH: string = "./backup";
// Correctly access the environment variable using process.env.DATABASE_NAME
const DATABASE_NAME: string | undefined = 'servers';

console.log(TOKEN, CHAT_ID, MONGO_URI, DATABASE_NAME);

// Ensure DATABASE_NAME is not undefined
if (!TOKEN || !CHAT_ID || !MONGO_URI || !DATABASE_NAME) {
  throw new Error("Missing required environment variables.");
}

function backupDatabase(): void {
  // eslint-disable-next-line no-useless-escape
  const command: string = `mongodump --uri="${MONGO_URI}" --out="${BACKUP_PATH}"`;

  exec(command, (error) => {
    if (error) {
      console.error("Error during database backup:", error);
      return;
    }
    console.log("Database backup created successfully");
    zipAndSend();
  });
}

async function zipAndSend(): Promise<void> {
  const output = fs.createWriteStream(`./backup/${DATABASE_NAME}.zip`);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", () => {
    console.log(
      `Archive created successfully. Total bytes: ${archive.pointer()}`
    );
    sendDocumentToTelegramChannel(`./backup/${DATABASE_NAME}.zip`, CHAT_ID, TOKEN)
      .then(() => {
        console.log("Backup sent to Telegram successfully.");
      })
      .catch((err) => {
        console.error("Failed to send backup to Telegram:", err);
      });
  });

  archive.on("error", (err: Error) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(`./backup/${DATABASE_NAME}/`, false);
  await archive.finalize();
}

async function sendDocumentToTelegramChannel(
  filePath: string,
  chatId: string,
  botToken: string
): Promise<void> {
  const url: string = `https://api.telegram.org/bot${botToken}/sendDocument`;
  const formData = new FormData();

  formData.append("document", createReadStream(filePath));
  formData.append("chat_id", chatId);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log("Document sent successfully:", response.data);
  } catch (error) {
    console.error("Failed to send document:", error);
  }
}

export default backupDatabase;
