# clone-dir

Clone a subdirectory from a GitHub repository easily using npx.

## Description

`clone-dir` is a command-line tool that allows you to clone a specific subdirectory from a GitHub repository without cloning the entire repo. It uses Git's sparse checkout feature to efficiently download only the files you need.

## Installation

You don't need to install this package globally. You can run it directly using npx:

```
npx clone-dir <github-url> <target-dir>
```

## Usage

To use `clone-dir`, run the following command:

```
npx clone-dir <github-url> <target-dir>
```

Replace `<github-url>` with the URL of the GitHub subdirectory you want to clone, and `<target-dir>` with the local directory where you want to clone the files.

### Example

To clone the `examples/expo-router` subdirectory from the `nativewind/nativewind` repository:

```
npx clone-dir https://github.com/nativewind/nativewind/tree/main/examples/expo-router my-expo-router-example
```

This will clone only the `examples/expo-router` subdirectory and its contents into the `my-expo-router-example` directory.

## Features

- Clone specific subdirectories from GitHub repositories
- Uses Git's sparse checkout for efficient cloning
- No need to clone entire repositories when you only need a subset of files

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
