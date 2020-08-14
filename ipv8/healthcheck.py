import sys
import requests
import json 

try:
    peers_request = requests.get('http://localhost:14410/attestation?type=peers')

    if peers_request.status_code != 200:
        exit(1)

    peers = json.loads(peers_request.text)

    if 'w+X9Eg+ZXDJ09Wyu13/U/7hMT3Q=' not in peers or 'LjOaZ24ZOENsB3eaQoHYci9hhRA=' not in peers:
        exit(1)

except:
    exit(1)
