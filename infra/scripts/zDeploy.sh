echo 'rm -rf /home/nik/code/deployments/dnd.rtlan.gr/*'
sudo rm -rf  /home/nik/code/deployments/dnd.rtlan.gr/*

npm run build

echo 'cp -r .next /home/nik/code/deployments/dnd.rtlan.gr/'
cp -r .next /home/nik/code/deployments/dnd.rtlan.gr/ 
cp -r prisma /home/nik/code/deployments/dnd.rtlan.gr/ 

echo 'cp package.json .nvmrc /home/nik/code/deployments/dnd.rtlan.gr/ '
cp package.json .nvmrc /home/nik/code/deployments/dnd.rtlan.gr/ 

cd /home/nik/code/deployments/dnd.rtlan.gr/
npm install --omit=dev

npm prisma:generate

pm2 delete all
pm2 start npm --name 'dnd-server' -- start -- --port 3500
sudo systemctl reload apache2
