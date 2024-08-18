## Steps to deploy elasticsearch on GKE

- Create a k8s cluster 
- configure kubectl ```gcloud container clusters get-credentials <cluster-name> --zone us-central1-f```
- download ECK operator ```kubectl create -f https://download.elastic.co/downloads/eck/2.7.0/crds.yaml```
- install the operator ```kubectl apply -f https://download.elastic.co/downloads/eck/2.7.0/operator.yaml```
- check if the operator is running ```kubectl get all -n elastic-system``` for logs ```kubectl -n elastic-system logs -f statefulset.apps/elastic-operator```
- deploy elasticsearch cluster ```kubectl apply -f es-deploy.yml```
- check the status of the cluster ```kubectl get elasticsearch```
- to check individual node status ```kubectl get pods --selector='elasticsearch.k8s.elastic.co/cluster-name=zipnews'```
- to get service information ```kubectl get service zipnews-es-http```
- get the password to use elasticsearch APIs ```PASSWORD=$(kubectl get secret zipnews-es-elastic-user -o go-template='{{.data.elastic | base64decode}}')```
- port forward the service ```kubectl port-forward service/zipnews-es-http 9200```
- test connection to es ```curl -u "elastic:$PASSWORD" -k "https://localhost:9200"``` 
- To connect to elasticsearch from python script, download the cert using the following steps 
```sh
# to access within k8s cluster 
NAME=zipnews

kubectl get secret "$NAME-es-http-certs-public" -o go-template='{{index .data "tls.crt" | base64decode }}' > tls.crt
PW=$(kubectl get secret "$NAME-es-elastic-user" -o go-template='{{.data.elastic | base64decode }}')

curl --cacert tls.crt -u elastic:$PW https://$NAME-es-http:9200/


# access outside the cluster 
NAME=zipnews
NAME=hulk

kubectl get secret "$NAME-es-http-certs-public" -o go-template='{{index .data "tls.crt" | base64decode }}' > tls.crt
IP=$(kubectl get svc "$NAME-es-http" -o jsonpath='{.status.loadBalancer.ingress[].ip}')
PW=$(kubectl get secret "$NAME-es-elastic-user" -o go-template='{{.data.elastic | base64decode }}')

curl --cacert tls.crt -u elastic:$PW https://$IP:9200/
```