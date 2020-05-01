FROM python:3.7-buster as ipv8
WORKDIR /usr/src/app

# Libsodium is not installed by default but required for IPv8
RUN apt-get update
RUN apt-get install libsodium-dev --yes
RUN git clone https://github.com/Tribler/py-ipv8.git pyipv8
RUN pip install --no-cache-dir -r ./pyipv8/requirements.txt

RUN touch __init__.py
COPY . .

CMD ["python", "main.py"]
