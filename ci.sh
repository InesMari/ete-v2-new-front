node -v
npm install -g yarn --registry=https://registry.npm.taobao.org
yarn  -v
yarn install
rm -rf ./dist/*

yarn build
rm -rf /app/yqyv2showweb/html/*
cp -rf ./dist/* /app/yqyv2showweb/html/*


