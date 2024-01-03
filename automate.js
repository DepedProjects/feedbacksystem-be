const { execSync } = require("child_process");
const path = require("path");

function automateCommand(command, options = {}) {
    try {
        console.log(`Running command: ${command}`);
        execSync(command, { stdio: "inherit", ...options });
        console.log(`Command successful: ${command}`);
    } catch (error) {
        console.error(`Error running command: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

const workingDirectory = path.resolve(__dirname);
console.log(`Setting working directory to: ${workingDirectory}`);
process.chdir(workingDirectory);

const prismaGenerate = "npx prisma generate";
const prismaMigrateDev = "npx prisma migrate dev";
const prismaMigrateDeploy = "npx prisma migrate deploy";
const npmRunDev = "npm run dev";

automateCommand(prismaGenerate);
automateCommand(prismaMigrateDev);
automateCommand(prismaMigrateDeploy);
automateCommand(npmRunDev);
