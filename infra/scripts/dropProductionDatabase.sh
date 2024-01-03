docker exec -i mysql-prod mysql -uroot -prpwd -e "drop database campaign_journal;" 
docker exec -i mysql-prod mysql -uroot -prpwd -e "create database campaign_journal;" 
