FROM node:14.17

COPY src/ /opt/app

WORKDIR /opt/app/

RUN npm install

CMD ["node", "/opt/app/app.js"]