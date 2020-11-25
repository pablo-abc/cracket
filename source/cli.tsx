#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './ui';

const cli = meow(`
Usage
  $ cracket

Options
	--per-page  Results per page

Usage
  Use the arrow keys to switch page.
  Press 'q' or 'Ctrl+C' to exit.

Examples
  $ cracket --per-page=1

  Name      Price     1h        24h       7d
  Bitcoin   $18929.9  -0.34865  -1.03432  7.24047
`, {
  flags: {
    perPage: {
      type: 'number'
    }
  }
});

render(<App perPage={cli.flags.perPage} />);
