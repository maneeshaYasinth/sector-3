# Use the base image for node
FROM node:20-alpine

#install nodemon globally
RUN npm install -g nodemon

#set the working directory
WORKDIR /app

#copy all files to the working directory
COPY . .

#install the dependencies
RUN npm install

#expose the port
EXPOSE 5000

#start the application
CMD ["npm", "start"]
