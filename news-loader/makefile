VERSION=v0
DOCKERUSER=preethammaiya

black:
	python -m black src

isort:
	python -m isort src

build:
	docker build -t zipnews-news-loader .

build-dev:
	docker build -t zipnews-news-loader:dev .

push:
	docker tag zipnews-news-loader $(DOCKERUSER)/zipnews-news-loader:$(VERSION)
	docker push $(DOCKERUSER)/zipnews-news-loader:$(VERSION)
	docker tag zipnews-news-loader $(DOCKERUSER)/zipnews-news-loader:latest
	docker push $(DOCKERUSER)/zipnews-news-loader:latest

deploy:
	kubectl apply -f deployment.yaml

delete:
	kubectl delete deploy/zipnews-news-loader