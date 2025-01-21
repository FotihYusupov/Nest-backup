import axios from "axios";
import { exec } from "child_process";
import * as archiver from "archiver";
import * as FormData from "form-data";
import { createReadStream, createWriteStream } from "fs";

const TOKEN: string | undefined = process.env.BOT_TOKEN;
const CHAT_ID: string | undefined = process.env.CHAT_ID;
const MONGO_URI: string | undefined = process.env.MONGO_URI;
const BACKUP_PATH: string = "./backup";
const DATABASE_NAME: string | undefined = process.env.DATABASE_NAME;

console.log(TOKEN, CHAT_ID, MONGO_URI, DATABASE_NAME);

if (!TOKEN || !CHAT_ID || !MONGO_URI || !DATABASE_NAME) {
  throw new Error("Missing required environment variables.");
}

function backupDatabase(): void {
  const command: string = `mongodump --uri="${MONGO_URI}" --out="${BACKUP_PATH}"`;

  exec(command, (error) => {
    if (error) {
      console.error("Error during database backup:", error);
      return;
    }
    console.log("Database backup created successfully");
    zipAndSend();
  });
  zipAndSend();
}

async function zipAndSend(): Promise<void> {
  const output = createWriteStream(`./backup/${DATABASE_NAME}.zip`);
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
  const url: string = `https://api.telegram.org/bot${botToken}/sendDocument;`
  const formData = new FormData();

  formData.append("document", createReadStream(filePath));
  formData.append("chat_id", +chatId);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    console.log("Document sent successfully:", response.data);
  } catch (error) {
    console.error("Failed to send document:", error.message);
  }
}

export default backupDatabase;
