echo "\n\nImport input date\n\n"

read inputDate;

docker exec -i mysql-dev mysql -uroot -prpwd -e "drop database campaign_journal;" 

docker exec -i mysql-dev mysql -uroot -prpwd -e "create database campaign_journal;" 


docker exec -i mysql-dev mysql -uroot -prpwd campaign_journal --force < ../../../campaign-journal-backend/mysql/backups/$inputDate.sql