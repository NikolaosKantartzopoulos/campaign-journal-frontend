echo "\n\nImport input date\n\n"

inputDate=$(date '+%y%m%d');

docker exec -i mysql-prod mysql -uroot -prpwd -e "drop database campaign_journal;" 

docker exec -i mysql-prod mysql -uroot -prpwd -e "create database campaign_journal;" 


docker exec -i mysql-prod mysql -uroot -prpwd campaign_journal --force < ../../../campaign-journal-backend/mysql/mysql/backups/$inputDate.sql

#cp -r ~/sambashare/development ~/sambashare/production