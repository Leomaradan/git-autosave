# Git Auto-Save
Perform auto-saving git repositories that correspond to some criteria

[![NPM version](https://img.shields.io/npm/v/git-autosave.svg)](https://www.npmjs.com/package/git-autosave)

# Installation
__With npm:__

```bash
npm install -g git-autosave
```

With yarn 1.x:
```bash
yarn global add git-autosave
```

With yarn 2+ (installing and executing):
```bash
yarn dlx git-autosave
```

# How to use

By default, the script will search for each git repository in the current folder, and in all subfolder, excluding node_modules folder

In each folder, it will search for the `package.json` file, and check if a `.git` folder exists. If that criteria match, the script will check if the current branch has a keyword in its name (default keyword: `draft`)

If all that critera match and there is some file to commit, it will add the files, commit with the date as a message, and push to origin.

__The script doesn't check the last commit date. Executing the command multiple time can result of a lot of commits. Use this command in a schedule task__

## Options
Some options can be configured:

* Base directory. The base directory can be set with `--dir=<my working dir>`
* Search Term. The default search term is `package.json`. It can be override with `--search=<my entry point>`
* Branch Term. The default branch term is `draft`. It can be override with `--branch=<my branch name>`
* Searching through node_modules. By default, the script omit node_modules folder. It can be override with `-i`

## Runing the script

With default options
```bash
git-autosave
```

Other examples
```bash
git-autosave --dir=".." -i
```

Other examples
```bash
git-autosave --dir="D:/Code/auto-save" --search=Gemfile --branch=temp
```