VERSION=v0
DOCKERUSER=preethammaiya

black:
	python -m black src

isort:
	python -m isort src

build:
	docker build -t zipnews-api .

build-dev:
	docker build -t zipnews-api:dev .

push:
	docker tag zipnews-api $(DOCKERUSER)/zipnews-api:$(VERSION)
	docker push $(DOCKERUSER)/zipnews-api:$(VERSION)
	docker tag zipnews-api $(DOCKERUSER)/zipnews-api:latest
	docker push $(DOCKERUSER)/zipnews-api:latest

deploy:
	kubectl apply -f deployment.yaml
	kubectl apply -f service.yaml

delete:
	kubectl delete deploy/zipnews-api
	kubectl delete service/zipnews-api-svc

port-forward:
	kubectl port-forward service/zipnews-api-svc 5005
