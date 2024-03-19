
FROM denoland/deno:1.41.3

WORKDIR /app

COPY . /app

EXPOSE 8000

RUN deno cache src/main.ts

CMD ["run","--allow-write", "--allow-read", "--allow-net", "src/main.ts"]