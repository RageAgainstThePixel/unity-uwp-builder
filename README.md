# unity-uwp-builder

A GitHub Action to build Unity exported UWP projects.

> [!NOTE]
> The main goal of this action to to take what is provided from Unity and package it to be directly uploaded to the Microsoft Store.

## How to use

### workflow

```yaml
steps:
  # required for unity-uwp-builder action
  - uses: microsoft/setup-msbuild@v2

  # builds visual studio project for UWP and packages it for store upload
  - uses: RageAgainstThePixel/unity-uwp-builder@v1
    id: uwp-build
    with:
      project-path: '/path/to/your/build/output/directory'
      architecture: 'ARM64'
      package-type: 'upload'

  - name: print outputs
    shell: bash
    run: |
      echo "Executable: ${{ steps.uwp-build.outputs.executable }}"
      echo "Output Directory: ${{ steps.uwp-build.outputs.output-directory }}"
      ls -R "${{ steps.uwp-build.outputs.output-directory }}"
```

### inputs

| name | description | required |
| ---- | ----------- | -------- |
| `project-path` | The directory that contains the exported visual studio project from Unity. | true |
| `configuration` | The configuration to use when building the visual studio project. | Defaults to `Master`. |
| `architecture` | The architecture to use when building the visual studio project. Can be: `x86`, `x64`, `ARM`, or `ARM64`. | Defaults to `ARM64`. |
| `package-type` | The type of package to generate. Can be: `sideload` or `upload`. | Defaults to `sideload`. |
| `certificate-path` | The path to the certificate to use when packaging the UWP project. | Required when `package-type` is `sideload`. Defaults to the Unity generated test certificate. |

### outputs

- `executable`: The path to the generated appx executable.
- `output-directory`: The path to the package output directory.
