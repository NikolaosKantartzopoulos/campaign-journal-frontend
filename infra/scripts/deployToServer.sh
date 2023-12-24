echo 'rm -rf /home/nik/code/deployments/dnd.rtlan.gr/*'
sudo rm -rf  /home/nik/code/deployments/dnd.rtlan.gr/*

cp -r ../* /home/nik/code/deployments/dnd.rtlan.gr/ 

cd /home/nik/code/deployments/dnd.rtlan.gr/campaign-journal-frontend
npm run build
npm install

npm prisma:generate

pm2 delete all
pm2 start npm --name 'dnd-server' -- start -- --port 3500
sudo systemctl reload apache2
