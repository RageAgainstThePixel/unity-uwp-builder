# unity-uwp-builder

A GitHub Action to build Unity exported UWP projects.

## How to use

### workflow

```yaml
steps:
  - uses: RageAgainstThePixel/unity-uwp-builder@v1
```

### inputs

| name | description | required |
| ---- | ----------- | -------- |
| `project-path` | The directory that contains the exported visual studio project from Unity. | true |
| `configuration` | The configuration to use when building the visual studio project. | Defaults to `Release`. |
| `architecture` | The architecture to use when building the visual studio project. Can be: `x86`, `x64`, `ARM`, or `ARM64`. | Defaults to `ARM64`. |
| `package-type` | The type of package to generate. Can be: `sideload` or `upload`. | Defaults to `sideload`. |

### outputs

- `executable`: The path to the generated appx executable.
- `export-path`: The path to the export directory.
