### HOW TO RUN
With admin privilege run de following command to docker compose the django enviroment.
'''
$ git clone https://github.com/fergo2910/excercise.git
$ cd exercise
$ sudo docker-compose run web_app django-admin.py startproject code_web_app .
$ sudo docker-compose up
'''

### CLEANING UP
'''
$ sudo docker stop $(docker ps -a -q)
$ sudo docker rm $(docker ps -a -q)
$ sudo docker rmi exercise_web_app
'''
