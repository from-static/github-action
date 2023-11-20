import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'

import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    const path: string = core.getInput('path')

    core.debug(`Locating ${path} ...`)

    const file = await readFile(path, { encoding: 'utf8' })

    if (!file) {
      throw Error(`Unable to locate ${path}.`)
    }

    core.debug(`Building using from-static/cli ...`)
    execSync(`npx https://github.com/from-static/cli.git build --path=${path}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
