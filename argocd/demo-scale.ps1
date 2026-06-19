(Get-Content .\k8s\deployment.yml) -replace 'replicas: 1', 'replicas: 3' | Set-Content .\k8s\deployment.yml
git add .\k8s\deployment.yml
git commit -m "Scale replicas to 3"
git push
