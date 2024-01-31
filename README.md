# miau

## How to run

### Requirements

- docker
- docker-compose

### Run

```bash
$ cd scripts
$ ./dev.sh
```

### Development

Edit the files locally and the changes will be reflected in the container.

### Interact with the container

#### Logs

```bash
$ cd scripts
$ ./log.sh backend
```

VSCode: `ctrl + shift + p` -> `Tasks: Run Task` -> `Container Logs`

#### Shell

```bash
$ cd scripts
$ ./shell.sh backend
```

VSCode: `ctrl + shift + p` -> `Tasks: Run Task` -> `Container Shell`
