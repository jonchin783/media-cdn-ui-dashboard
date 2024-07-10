# Google Media CDN custom UI dashboard

This repository contains an Express Node.js microservices application for a custom Google Media CDN User Interface. 

## How to setup

1. Build a docker container image using the Dockerfile from this repository or use Google Cloud Build to build and push the container image to Artifact Repository
2. Deploy the container image on Google Cloud Run or on GKE behind GCLB in the same GCP project where your Media CDN services are created and running
3. On initialization, the application code will authenticate with the default compute engine service account and retrieve the list of Media CDN Edge Cache and Edge Origins in the project
4. Modify the application code to include other functions using Media CDN Network Services API (https://cloud.google.com/media-cdn/docs/apis), for example to download the Edge Cache YAMLs, modify them, and upload the services to effect changes
