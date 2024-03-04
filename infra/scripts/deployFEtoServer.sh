remote_server="nik@192.168.1.99"


yarn install
npm run build

ssh $remote_server << 'EOF'
mkdir -p /home/nik/code/deployments/dnd.rtlan.gr/campaign-journal-frontend/
exit

EOF

scp -r .next $remote_server:/home/nik/code/deployments/dnd.rtlan.gr/campaign-journal-frontend/
scp -r prisma $remote_server:/home/nik/code/deployments/dnd.rtlan.gr/campaign-journal-frontend/
scp package.json .nvmrc .env.production $remote_server:/home/nik/code/deployments/dnd.rtlan.gr/campaign-journal-frontend/ 

# SSH back into the server and execute remaining commands
ssh $remote_server << 'EOF'

cd /home/nik/code/deployments/dnd.rtlan.gr/campaign-journal-frontend/
yarn install --omit=dev
yarn prisma:generate
yarn start --port 3500

EOF

# pm2 delete all
# pm2 start npm --name 'dnd-server' -- start -- --port 3500
# sudo systemctl reload apache2
# yarn start --port 3500