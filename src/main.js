#!/usr/local/bin/node

import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import ora from 'ora';
import yaml from 'js-yaml';
import fs from 'fs';

const repositories = yaml.load(fs.readFileSync('./repositories.yml', 'utf8'));

async function projectName() {
  const answers = await inquirer.prompt({
    name: 'projectName',
    type: 'input',
    message: 'Project name'
  });

  return answers.projectName;
}

async function language() {
  const answers = await inquirer.prompt({
    name: 'language',
    type: 'list',
    message: 'Select a language:',
    choices: Object.keys(repositories),
  });

  return answers.language;
}

async function repo() {
  const selectedLanguage = await language();
  const selectedRepo = await inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'Select a repository:',
    choices: repositories[selectedLanguage].map(repo => Object.keys(repo)[0]),
  });

  return  repositories[selectedLanguage].find(repo => Object.keys(repo)[0] === selectedRepo.repo)[selectedRepo.repo];;
}

simpleGit().clone(await repo(), await projectName(), (error, result) => {
  const spinner = ora('Cloning repository...').start();
  if (error) {
    spinner.fail('Error cloning repository', error);
  } else {
    spinner.succeed('Repository cloned successfully');
  }
});
