# MAPBOX SAMPLE ENVIRONMENT

FROM node:13.8.0

RUN apt-get update
RUN apt-get -y upgrade

RUN apt-get install -y vim less tree

RUN apt-get -y install locales
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9

RUN echo 'alias ls="ls --color=auto"' >> ~/.bashrc
RUN echo 'alias ll="ls -l --color=auto"' >> ~/.bashrc
RUN echo 'alias la="ls -la --color=auto"' >> ~/.bashrc
RUN echo 'alias grep="grep --color=auto"' >> ~/.bashrc
RUN echo 'alias tree="tree -N"' >> ~/.bashrc
RUN echo 'export PS1="\[\e[0;35m\]\u@\h:\w\[\e[m\]\n\$ "' >> ~/.bashrc