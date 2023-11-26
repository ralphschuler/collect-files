import * as core from '@actions/core'
import { globSync } from 'glob'
import * as fs from 'fs'
import * as path from 'path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const pattern = core.getInput('pattern')
    const output_directory =
      core.getInput('output_directory') ||
      `./${Math.random().toString(36).substring(7)}`

    core.debug(
      `Collecting files matching '${pattern}' into '${output_directory}'`
    )

    const files = globSync(pattern, {})
    files.forEach((file: string, index: number) => {
      const targetPath = path.resolve(
        output_directory,
        `${index}-${path.basename(file)}`
      )
      fs.copyFileSync(file, targetPath)
      core.debug(`Copied '${file}' to '${targetPath}'`)
    })

    core.debug('Collection complete.')
    core.setOutput('output_directory', output_directory)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
