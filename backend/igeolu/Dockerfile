FROM openjdk:17-jdk-slim

ARG JAR_FILE=build/libs/*.jar
# jar 파일 복제
COPY ${JAR_FILE} app.jar

ENV TZ=Asia/Seoul \
    LANG=ko_KR.UTF-8 \
    JASYPT_ENCRYPTOR_KEY=${JASYPT_KEY}
# prod 파일 실행 명령어
# ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
ENTRYPOINT ["java", "-jar", "/app.jar"]