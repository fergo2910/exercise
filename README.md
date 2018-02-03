### HOW TO RUN
With admin privilege run de following command to docker compose the django enviroment.
```
$ git clone https://github.com/fergo2910/exercise.git
$ cd exercise
$ docker-compose up
```
If you want to connect into the database, you can run the following command to the redis container
```
docker exec -it <container> redis-cli [-h <hostname>]
```

### CONFIGURATION
For redis persistence storage change the volumne directory to your folder to store the data at the docker-compose.yml file.
```
volumes:
- //c/Users/fjgonzalez/Music/data:/data
```
For Node.js app to recognize redis, Node.js calls redis with the hostname in the  `code_node_api/node_modules/redis/index.js` where is define the port and the host (line 70).

### RUNNING THE APP
Una vez que el ambiente esté funcionando se debe ejecutar la siguinte url: `localhost/exercise_redis/home`.
In the `localhost/exercise_redis/elements` you can add products and search products.

### CLEANING UP
When you want to try new changes into code, you need stop docker-compose with `Ctrl + C` and remove the images that were created with the docker-compose.
Also you can run the commands.
```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker images
docker rmi exercise_web_app_01
docker rmi exercise_web_app_02
```
So you can start from scratch.
