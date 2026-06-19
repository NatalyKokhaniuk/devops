helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install mydb bitnami/postgresql -f .\helm\postgres-values.yaml
helm upgrade --install myapp .\helm\rest-api-chart
kubectl get pods
helm list
