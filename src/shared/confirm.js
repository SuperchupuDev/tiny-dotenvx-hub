import { ConfirmPrompt } from '@clack/core';

export default opts => {
  return new ConfirmPrompt({
    active: 'Y',
    inactive: 'N',
    initialValue: true,
    render() {
      return `${opts.message} (${this.value ? 'Y/n' : 'y/N'})`;
    }
  }).prompt();
};
