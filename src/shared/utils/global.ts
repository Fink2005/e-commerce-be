export const logPrettier = (log: unknown, message: string = "Here") => {
// eslint-disable-next-line no-console
console.log('\x1b[34m',message, JSON.stringify(log, null, 2)
)
}
