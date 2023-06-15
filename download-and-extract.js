const https = require("https");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const chunksUrl = "https://owncloud.tuwien.ac.at/index.php/s/ei5F6KJyZYtFQ1j/download";
const videosUrl = "https://owncloud.tuwien.ac.at/index.php/s/rRHxMg4FcOg8RNA/download";
const chunksDestinationPath = path.resolve("./public/chunks.zip");
const videosDestinationPath = path.resolve("./public/videos.zip");
const chunksFolderPath = path.resolve("./public/chunks");
const videosFolderPath = path.resolve("./public/videos");

function folderExists(folderPath) {
  return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory();
}

async function removeFolder(folderPath) {
  const contents = await fs.promises.readdir(folderPath);

  for (const item of contents) {
    const itemPath = path.join(folderPath, item);
    const stats = await fs.promises.lstat(itemPath);

    if (stats.isDirectory()) {
      await removeFolder(itemPath);
    } else {
      await fs.promises.unlink(itemPath);
    }
  }

  await fs.promises.rmdir(folderPath);
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(resolve);
      });
    });

    request.on("error", (error) => {
      fs.unlink(dest);
      reject(error);
    });

    file.on("error", (error) => {
      fs.unlink(dest);
      reject(error);
    });
  });
}

function extractZipFile(zipPath, outputPath) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputPath, true);
}

(async () => {
  try {
    if (!folderExists(chunksFolderPath)) {
      console.log("Downloading chunks.zip file...");
      await downloadFile(chunksUrl, chunksDestinationPath);
      console.log("Download complete.");

      console.log("Extracting chunks.zip file...");
      extractZipFile(chunksDestinationPath, path.dirname(chunksFolderPath));
      console.log("Extraction complete.");

      console.log("Removing chunks.zip file...");
      fs.unlinkSync(chunksDestinationPath);
      console.log("chunks.zip file removed.");
    } else {
      console.log("Chunks folder already exists. Skipping download and extraction.");
    }

    if (!folderExists(videosFolderPath)) {
      console.log("Downloading videos.zip file...");
      await downloadFile(videosUrl, videosDestinationPath);
      console.log("Download complete.");

      console.log("Extracting videos.zip file...");
      extractZipFile(videosDestinationPath, path.dirname(videosFolderPath));
      console.log("Extraction complete.");

      console.log("Removing videos.zip file...");
      fs.unlinkSync(videosDestinationPath);
      console.log("videos.zip file removed.");
    } else {
      console.log("Videos folder already exists. Skipping download and extraction.");
    }

    console.log("Done.");
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
})();
