import { readFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'

import * as core from '@actions/core'
import * as github from '@actions/github'

export async function run(): Promise<void> {
  try {
    const path: string = core.getInput('path')

    core.debug(`Locating ${path} ...`)

    const file = await readFile(path, { encoding: 'utf8' })

    if (!file) {
      throw Error(`Unable to locate ${path}.`)
    }

    execSync(
      'git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "git@github.com:"'
    )

    core.debug(`Building using from-static/cli ...`)
    /**
     * Execute the from-static/cli build command, using the current repository as the base path.
     */
    execSync(
      `npx https://github.com/from-static/cli.git build --path=${path} --next-base-path="/${github.context.repo.repo}"`
    )
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
