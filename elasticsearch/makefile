
deploy:
	kubectl create -f https://download.elastic.co/downloads/eck/2.7.0/crds.yaml
	sleep 15
	kubectl apply -f https://download.elastic.co/downloads/eck/2.7.0/operator.yaml
	sleep 10 
	kubectl apply -f es-deploy.yml

delete:
	kubectl delete elasticsearch/zipnews
	kubectl get namespaces --no-headers -o custom-columns=:metadata.name | xargs -n1 kubectl delete elastic --all -n
	kubectl delete -f https://download.elastic.co/downloads/eck/2.7.0/operator.yaml
	kubectl delete -f https://download.elastic.co/downloads/eck/2.7.0/crds.yaml

port-forward:
	kubectl port-forward service/zipnews-es-http 9200