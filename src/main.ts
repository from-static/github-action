import { readFile, mkdir, writeFile } from 'node:fs/promises'

import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    const path: string = core.getInput('path')

    core.debug(`Locating ${path} ...`)

    const file = await readFile(path, { encoding: 'utf8' })

    if (!file) {
      throw Error(`Unable to locate ${path}.`)
    }

    const config = JSON.parse(file)

    let output
    if (config.type === 'RESUME') {
      output = [
        '<ul>',
        ...config.contents.experience?.map(
          (e: any) =>
            `<li>${e.title} &mdash; ${e.company_name} &mdash; ${e.location}</li>`
        ),
        '</ul>'
      ]
    }

    if (config.type === 'RESEARCH_DATA_PORTAL') {
      output = `@todo`
    }

    if (!output) {
      throw Error(`No renderer found for type: ${config.type}`)
    }

    await mkdir('out')

    await writeFile('out/index.html', config.version)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
