import chalk from 'chalk';

export const error = (message: string): void => console.error(chalk.whiteBright.bgRedBright(message));
export const warning = (message: string): void => console.warn(chalk.bgYellowBright(message));
export const info = (message: string): void => console.info(chalk.blue(message));
export const verbose = (message: string): void => console.log(chalk.black(message));
export const ok = (message: string): void => console.log(chalk.green(message));
