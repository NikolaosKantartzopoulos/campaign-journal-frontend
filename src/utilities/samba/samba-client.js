import fs from "fs";
import smb2 from "smb2";

export const smbClient = new smb2({
  share: "\\\\192.168.1.100\\sambashare",
  domain: "DOMAIN",
  username: "nik",
  password: "smbrpwd",
});

export async function uploadFileToSamba(filePath) {
  const fileStream = fs.createReadStream(filePath);

  try {
    await smbClient.writeFile("file_on_samba.png", fileStream);
    console.log("File uploaded successfully to Samba share.");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export async function readTextFileFromSamba(filePath) {
  try {
    const fileContent = await smbClient.readFile(filePath, "utf8");
    console.log("File content:", fileContent);
    return fileContent;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}
