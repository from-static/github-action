# We suggest using our [reusable workflows](https://github.com/from-static/actions) rather than using this action directly.

This repository will likely be deprecated in the future.

# from-static/github-action

The `from-static/github-action` is used to generate a static site from a
`static.json` file using the
[`from-static` CLI](https://github.com/from-static/cli).

## Usage

Used in conjunction with GitHub's pages-related actions, this action can be used
to generate a static site from a `static.json` file and deploy it to GitHub
Pages.

The workflow below is used in most `static` template repositories to enable
continuous deployment to GitHub Pages.

```yaml
name: static
on:
  # Runs on pushes to "main"
  push:
    branches:
      - main
  # Allows manual dispatch
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  static:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Generate from static.json
        uses: from-static/github-action@main
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
