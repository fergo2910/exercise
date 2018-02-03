## HOW TO RUN
With admin privilege run de following command to docker compose the django enviroment.
```
$ git clone https://github.com/fergo2910/exercise.git
$ cd exercise
$ docker-compose up [-d]
```
And then enter to the landpage `localhost/exercise_redis/home`
If you want to connect into the database, you can run the following command to the redis container
```
docker exec -it <container> redis-cli [-h <hostname>]
```

# CONFIGURATION
For redis persistence storage change the volumne directory to your folder to store the data at the docker-compose.yml file.
```
volumes:
- //c/Users/fjgonzalez/Music/data:/data
```
For Node.js app to recognize redis, Node.js calls redis with the hostname in the  `code_node_api/node_modules/redis/index.js` where is define the port and the host (line 70).

### RUNNING THE APP
Once the environment is working, the following url should be executed: `localhost/exercise_redis/home`.
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

# DEPLOY WITH CFN
If you want the same enviroment in cloud you could run a CFN service with the following steps.
1. Go to your aws console and EC2 service.
2. Generate a` Key-pair` to connect to an EC2 Instance.
3. This will save a `key.pem` file with a rsa key. Save this key into your root project.
4. change the privileges of the `key.pem` with the command `chmod 400 key.pem` so the key wont be modifiable, only readable.
5. Now, you need to create a user in your aws account.
   1. Go to your console
   2.  Go to IAM service
   3.  Users, and create a user and save the public and secrete keys of the user.
6.  Set up a profile for aws-cli with the command `aws configure --profile exercise`
1. Item 3
   1. Enter the public key of the created user
   2.  Enter the private key of the created user
   3.  Choose your region
   4.  You can leave the default format in blank
7.  Now with aws configured run, the following command to create the CloudFormation stack in AWS.
```
aws cloudformation create-stack --stack-name some-stack --template-body file://$PWD/stack.yml --profile exercise --region us-west-2
```
8.  When the stack is **CREATE_COMPLETE** you need to go to Resources and click in the Physical ID of the EC2_Deploy and copy the public IP of the instance.
9.  You have to configure a volumne for redis in the aws-docker-compose.yml using:
```
docker -H tcp://<public ip>:2375 volume create \
  -d "cloudstor:aws" \
  --opt ebstype=gp2 \
  --opt size=10 \
  --opt iops=1000 \
  --opt backing=relocatable \
  data-volume-1
```
10. Finally, you can run docker-compose -H tcp://public_ip:2375 up -f aws-docker-compose.yml
