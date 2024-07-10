# media-cdn-ui-dashboard
Express NodeJS custom UI dashboard for Google Media CDN Service

# Instructions
This is a custom UI dashboard to demo Google Media CDN Service using its Network Services API (https://cloud.google.com/media-cdn/docs/apis)

1. Build the docker container image using the Dockerfile in this repository
2. Or, use Google Cloud Build to build the container image and upload it to Artifact Repository
3. Deploy the container image on Google Cloud Run (or GKE behind GCLB) in the same GCP project where your Media CDN services are created and running
4. On iniialization, this custom UI dashboard application will authenticate with default compute service account and retrieve the list of Media CDN Edge Cache and Edge Origin services
5. Modify the application code in this repository and using the Network Services API to add other functions, such as modifying the YAML contents of Media CDN Edge Cache services
