const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const argv = require('argv');

/**
 * Recursive walk, and search for repos
 * @param {string} dir - Base directory
 * @param {{includeNodeModule: boolean; searchTerm: string; branchTerm: string}} options - Options for searching
 */
const walk = (dir, options) => {
  const list = fs.readdirSync(dir);
  list.forEach(filename => {
    const file = path.resolve(dir, filename);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      if (options.includeNodeModule || filename.indexOf('node_modules') === -1) {
        walk(file, options);
      }
    } else {
      if (filename.indexOf(options.searchTerm) !== -1) {
        // Check if there is a git folder
        const gitFolder = path.resolve(dir, '.git');

        if (fs.existsSync(gitFolder)) {
          const currentFolder = simpleGit(dir);
          currentFolder.checkIsRepo((_, response) => {
            if (response) {
              checkAndCommit(currentFolder, options.branchTerm);
            }
          });
        }
      }
    }
  });
};

/**
 * Perform git add, git commit and git push
 * @param {*} git - SimpleGit handler
 * @param {string} branchTerm - Keywork that must appear on the branch name to activate auto-saving
 */
const checkAndCommit = (git, branchTerm) => {
  git.status((_, status) => {
    const { files, current } = status;
    if (current.indexOf(branchTerm) !== -1 && files.length > 0) {
      console.log(`Auto-saving ${current}`);
      git.add(files.map(file => file.path))
        .commit(`Auto-saving (${(new Date()).toISOString()})`)
        .push([], () => console.log('done'));
    }
  });
}

argv.option([
  {
    name: 'dir',
    type: 'path',
    description: 'Base path entry point',
    example: "'git-autosave --dir=\".\"'"
  },
  {
    name: 'search',
    type: 'string',
    description: 'Search item to determine which folder is a git repo',
    example: "'git-autosave --search=package.lock'"
  },
  {
    name: 'branch',
    type: 'string',
    description: 'keywork in a branch to determine if the branch must be auto-saved',
    example: "'git-autosave --branch=draft'"
  },
  {
    name: 'include-node',
    short: 'i',
    type: 'boolean',
    description: 'Include searching through node_modules folder. Can be very slow',
    example: "'git-autosave -i'"
  }
]);

const resolve = argv.run();

const defaultSearchTerm = 'package.json';
const defaultBranchTerm = 'draft';

const baseDir = resolve.options.dir !== undefined ? resolve.options.dir : path.resolve('.');
const searchTerm = resolve.options.search !== undefined ? resolve.options.search : defaultSearchTerm;
const branchTerm = resolve.options.branch !== undefined ? resolve.options.branch : defaultBranchTerm;
const includeNodeModule = resolve.options['include-node'] !== undefined ? resolve.options['include-node'] : false;

walk(baseDir, { searchTerm, branchTerm, includeNodeModule });
