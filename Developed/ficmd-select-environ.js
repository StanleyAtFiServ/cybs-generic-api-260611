// developed/selectEnv.js
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer').default;

async function main() {
  const projectRoot = __dirname;
  const resourcesDir = path.join(projectRoot, 'Resources');

  // Step 1: scan sub-folders
  const subFolders = fs.readdirSync(resourcesDir).filter(f => {
    const fullPath = path.join(resourcesDir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  // Step 2: prompt user to select
const { chosenFolder } = await inquirer.prompt([
  {
    type: 'select',   // instead of 'list'
    name: 'chosenFolder',
    message: 'Select a Resources sub-folder:',
    choices: subFolders
  }
]);

  const chosenPath = path.join(resourcesDir, chosenFolder);

  // Step 3: find env file inside chosen folder
  const envFile = fs.readdirSync(chosenPath).find(f => f.startsWith('.env-'));
  if (!envFile) {
    console.error(`No env file found in ${chosenFolder}`);
    return;
  }

  const sourceFile = path.join(chosenPath, envFile);
  const destFile = path.join(projectRoot, '.env');

  // Step 4: copy and rename
  fs.copyFileSync(sourceFile, destFile);

  console.log(`Copied ${envFile} from ${chosenFolder} to project root as .env`);
}

main().catch(err => console.error(err));
