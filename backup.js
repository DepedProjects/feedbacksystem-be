// backup.js
const fs = require('fs');
const { exec } = require('child_process');
const cron = require('node-cron');
require('dotenv').config();

const backupDirectory = 'C:\\Users\\ICTS-Justin\\Desktop';

// Create the backup directory if it doesn't exist
// if (!fs.existsSync(backupDirectory)) {
//   fs.mkdirSync(backupDirectory);
// }

// const backupScript = `
//   "C:\Users\ICTS-Justin\Desktop\Backups\mysqldump.exe" --user=${process.env.DB_USER || "root"} --password=${process.env.DB_PASSWORD || "deped123"} ${process.env.DB_NAME || "feedbacksys"} > "${backupDirectory}\\backup_$(date +%%Y%%m%%d%%H%%M%%S).sql"
// `;


// // Schedule the cron job to run every day at 12 AM
// cron.schedule('*/1 * * * *', () => {
//   console.log('Cron job triggered every minute');
//   exec(backupScript, (error, stdout, stderr) => {
//     console.log('Inside exec callback');
//     console.log(`Error: ${error}`);
//     console.log(`Stdout: ${stdout}`);
//     console.log(`Stderr: ${stderr}`);
//     if (error) {
//       console.error(`Backup failed: ${stderr}`);
//     } else {
//       console.log(`Backup successful: ${stdout}`);
//     }
//   });
// });
