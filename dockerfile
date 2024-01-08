FROM node:21-alpine

#create app directory

WORKDIR /app


#install app dependencies

COPY package*.json ./

#run npm install


RUN npm install


#Bundle app source 

COPY . .

EXPOSE 9000

CMD ["npm", "run", "dev"]