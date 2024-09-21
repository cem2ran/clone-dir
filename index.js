#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseGitHubUrl(url) {
  const regex = /https:\/\/github\.com\/(.+?)\/(.+?)\/tree\/(.+?)\/(.+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }
  return {
    owner: match[1],
    repo: match[2],
    branch: match[3],
    subdir: match[4]
  };
}

function cloneSubdir(githubUrl, targetDir, v) {
  const { owner, repo, branch, subdir } = parseGitHubUrl(githubUrl);
  const repoUrl = `https://github.com/${owner}/${repo}.git`;

  // Create a temporary directory
  const tempDir = fs.mkdtempSync('clone-dir-');

  try {
    // Step 1: Clone the repository with --no-checkout
    console.log(`Cloning ${repoUrl}...`);
    const cloneCommand = `git clone --no-checkout ${repoUrl} ${tempDir}`;
    if(v) console.log(`Executing: ${cloneCommand}`);
    execSync(cloneCommand);

    // Change to the temporary directory
    process.chdir(tempDir);

    // Step 2: Enable sparse checkout
    console.log('Enabling sparse checkout...');
    const sparseInitCommand = 'git sparse-checkout init';
    if(v) console.log(`Executing: ${sparseInitCommand}`);
    execSync(sparseInitCommand);

    // Step 3: Define the subdirectory
    console.log(`Setting sparse-checkout for subdirectory: ${subdir}`);
    const sparseSetCommand = `git sparse-checkout set ${subdir}`;
    if(v) console.log(`Executing: ${sparseSetCommand}`);
    execSync(sparseSetCommand);

    // Step 4: Checkout the subdirectory
    console.log(`Checking out branch ${branch} and subdirectory ${subdir}...`);
    const checkoutCommand = `git checkout ${branch}`;
    if(v) console.log(`Executing: ${checkoutCommand}`);
    execSync(checkoutCommand);

    process.chdir("..");

    // Copy the subdirectory to the target directory
    const sourceDir = path.join(tempDir, subdir);
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created target directory: ${targetDir}`);
    const copyCommand = `cp -R ${sourceDir}/* ${targetDir}`;
    if(v) console.log(`Executing: ${copyCommand}`);
    execSync(copyCommand);

    console.log(`Successfully cloned ${subdir} to ${targetDir}`);
  } finally {
    // Clean up: remove the temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose'); // Check for verbose flag
if (args.length !== (verbose ? 3 : 2)) {
  console.error('Usage: npx clone-dir <github-url> <target-dir> [--verbose]');
  process.exit(1);
}

const [githubUrl, targetDir] = args.filter(arg => arg !== '--verbose');


// Execute the clone
cloneSubdir(githubUrl, targetDir, verbose);