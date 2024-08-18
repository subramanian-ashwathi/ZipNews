VERSION=v0
DOCKERUSER=preethammaiya


build:
	docker build -t zipnews-ui .

build-dev:
	docker build -t zipnews-ui:dev .

push:
	docker tag zipnews-ui $(DOCKERUSER)/zipnews-ui:$(VERSION)
	docker push $(DOCKERUSER)/zipnews-ui:$(VERSION)
	docker tag zipnews-ui $(DOCKERUSER)/zipnews-ui:latest
	docker push $(DOCKERUSER)/zipnews-ui:latest

deploy:
	kubectl apply -f deployment.yaml
	kubectl apply -f service.yaml

delete:
	kubectl delete deploy/zipnews-ui
	kubectl delete service/zipnews-ui-svc

port-forward:
	kubectl port-forward service/zipnews-ui-svc 3000
