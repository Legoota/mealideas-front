FROM busybox:1.35
RUN adduser -D static
USER static
WORKDIR /home/static
COPY dist .
CMD ["busybox", "httpd", "-f", "-v", "-p", "7777"]