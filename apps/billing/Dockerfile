FROM node:18-alpine As development

WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./

RUN yarn --pure-lockfile

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node


# DEVELOPMENT
FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV production

RUN yarn install --immutable --immutable-cache --check-cache

USER node


# PRODUCTION
FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]