FROM python:3.9-alpine

WORKDIR /gencal
COPY requirements.txt *.py ./
RUN pip3 install -r requirements.txt

CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0" ]