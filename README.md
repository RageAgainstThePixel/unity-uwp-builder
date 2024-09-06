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

### outputs

- `executable`: The path to the generated appx executable.
- `export-path`: The path to the export directory.
