FROM node:20-alpine AS build

WORKDIR /src
COPY . /src
RUN yarn install --immutable
RUN yarn pre-build
RUN yarn ts:build
RUN yarn ae:build

FROM scratch AS export
COPY --from=build /src/build/api .
