FROM ubuntu-with-python

LABEL Name=label_tool Version=0.0.1
EXPOSE 80

WORKDIR /app
ADD . /app
ENV LANG C.UTF-8

# Using pip:
RUN mkdir upload
RUN python3 -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple  -r requirements.txt
RUN python3 manage.py db init&&python3 manage.py db migrate -m "init"&&python3 manage.py db upgrade
CMD ["gunicorn", "-c", "gunicorn.conf","manage:app"]