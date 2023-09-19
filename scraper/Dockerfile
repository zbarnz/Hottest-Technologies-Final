FROM --platform=linux/x86_64 node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "node", "build/src/index.js" ]
