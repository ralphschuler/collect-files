import * as core from '@actions/core'
import * as glob from "glob"
import * as fs from "fs"
import * as path from "path"

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const pattern = core.getInput('pattern');
    const output_directory = core.getInput('output_directory') || `./${Buffer.from(new Date().toISOString()).toString('base64')}`;

    core.debug(`Collecting files matching '${pattern}' into '${target}'`);

    glob(pattern, {}, (err, files) => {
        if (err) throw err;
        files.forEach((file, index) => {
            const targetPath = path.resolve(output_directory, `${index}-${path.basename(file)}`);
            fs.copyFileSync(file, targetPath);
            core.debug(`Copied '${file}' to '${targetPath}'`);
        });
    });

    core.debug('Collection complete.');
    core.setOutput('output_directory', output_directory);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
