# miau
![image](https://github.com/JanGospodarek/company-chat/assets/102610659/8f6f5453-47af-475b-89c4-ecf7eb0fdf49)

![image](https://github.com/JanGospodarek/company-chat/assets/102610659/57d843f4-143d-4f62-8e70-d309da74ca62)

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
