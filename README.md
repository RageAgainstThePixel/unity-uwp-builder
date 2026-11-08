# unity-uwp-builder

A GitHub Action to build Unity exported UWP projects.

> [!NOTE]
> The main goal of this action is to take what is provided from Unity and package it to be directly uploaded to the Microsoft Store.

## How to use

The action runs on Windows runners only, and needs `msbuild` on the `PATH`.

### Workflow

```yaml
jobs:
  build:
    runs-on: windows-latest
    steps:
      # export the WSAPlayer build from Unity first, for example with unity-action
      - uses: RageAgainstThePixel/unity-action@v4
        with:
          build-target: WSAPlayer
          log-name: WSAPlayer-Build
          args: -quit -batchmode -nographics -executeMethod Utilities.Editor.BuildPipeline.UnityPlayerBuildTools.StartCommandLineBuild -arch ARM64

      # required for unity-uwp-builder action
      - uses: microsoft/setup-msbuild@v3

      # builds visual studio project for UWP and packages it for store upload
      - uses: RageAgainstThePixel/unity-uwp-builder@v2
        id: uwp-build
        with:
          project-path: path/to/your/build/output/directory
          architecture: ARM64
          package-type: upload

      - name: print outputs
        shell: bash
        env:
          EXECUTABLE: ${{ steps.uwp-build.outputs.executable }}
          OUTPUT_DIRECTORY: ${{ steps.uwp-build.outputs.output-directory }}
        run: |
          echo "Executable: ${EXECUTABLE}"
          echo "Output Directory: ${OUTPUT_DIRECTORY}"
          ls -R "${OUTPUT_DIRECTORY}"
```

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `project-path` | The directory that contains the exported visual studio project from Unity, or the path to its `.sln` file. The first `.sln` found under the directory is built. | true | |
| `configuration` | The configuration to use when building the visual studio project. | false | `Master` |
| `architecture` | The architecture to use when building the visual studio project. Can be: `x86`, `x64`, `ARM`, or `ARM64`. | false | `ARM64` |
| `additional-args` | Additional arguments to pass to the msbuild command, separated by spaces. | false | |
| `package-type` | The type of package to generate. Can be: `sideload` or `upload`. | false | `sideload` |
| `certificate-path` | The path to the `.pfx` certificate, or a directory to search for one, used to sign a `sideload` package. | false | The first `.pfx` in the exported project, such as the Unity generated test certificate |

When the exported project asks for a platform toolset the runner's Visual Studio doesn't have, the newest installed UWP toolset is used instead.

### Outputs

| Output | Description |
|--------|-------------|
| `executable` | The path to the generated package: the `.appxupload`/`.msixupload` for `upload`, or the `.appx`/`.msix` for `sideload`. |
| `output-directory` | The path to the `AppPackages` output directory. |

The action runs on Node 24, so self-hosted runners need [actions/runner](https://github.com/actions/runner) v2.327.1 or newer.
