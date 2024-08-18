# zipnews

## Development

All source code is contained within `src/` directory. The dockerfile and kubernetes yaml files are in the base directory of this service. 
The `src/` directory has the `flask` server source code. It uses `config.py` to store all service related configs. 
For good maintainance, `black` and `isort` is used. This can be run by `make black` and `make isort`.

To install all dependencies, run `pip install -r requirements.txt`

## Deployment

This service has a `dockerfile` for building the image. To build, run `make build`. For faster development, it also builds a local image, which can be run by `make build-dev`. Tihs uses Kubernetes for container management. Run `make run` to get the service up.