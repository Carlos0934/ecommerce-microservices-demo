
FROM denoland/deno:alpine-1.41.3

WORKDIR /app

ADD . /app

EXPOSE 8000

RUN deno cache src/main.ts

CMD ["run","--allow-write", "--allow-read", "--allow-net", "src/main.ts"]