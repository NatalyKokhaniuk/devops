helm upgrade myapp .\helm\rest-api-chart --set replicaCount=4
kubectl get pods
helm history myapp
helm rollback myapp 1
kubectl get pods
