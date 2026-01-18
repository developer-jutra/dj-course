docker run --name mongo-products \
  -p 27017:27017 \
  -v mongo-products-data:/data/db \
  -e MONGO_INITDB_DATABASE=products \
  --restart unless-stopped \
  -d mongo:7.0.16
