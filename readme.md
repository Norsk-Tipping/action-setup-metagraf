# action-setup-metagraf
Use the MetaGraf `mg` tool in GitHub Actions.

This actions sets up and installs MetaGraf.


## Usage

Basic:

```
steps:
    - uses: norsk-tipping/action-setup-metagraf@main
      with:
        version: '0.1.11' # version is optional, default is latest
    - run: mg
```

## Development

Source code lives in `src/index.js` and is built by running `yarn build`.

Both `src/index.js` as well as `dist/index.js` should be checked in and committed.

## License
The scripts and documentation in this project are released under the <license>

## Contributions
Contributions are welcome!