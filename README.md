# Lab 3 — Kubernetes та Helm

## kubectl-only
```powershell
.\k8s\start-minikube.ps1
.\k8s\deploy.ps1
```

## helm-deploy
```powershell
.\helm\deploy.ps1
.\helm\upgrade-rollback.ps1
```

БД для helm-deploy: `bitnami/postgresql` через `helm/postgres-values.yaml`.
