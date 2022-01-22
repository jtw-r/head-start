#!/usr/bin/env node

let o = require("./.head_start/commands/functions/txtutils");
require('yargs/yargs')(process.argv.slice(2))
    .command('*', false, () => {}, (argv) => {
        o.Empty();
        o.Divider();
        o.Error('Unknown command passed. Please run this script with --help appended if you are new.');
        o.Divider();
    })
    .hide('*')
    .commandDir('.head_start/commands', { extensions: ['js'] })
    .help()
    .wrap(90)
    .argv;

