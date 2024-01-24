# server.py

import http.server
import socketserver

PORT = 8000

handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(*args, directory='/home/chris/src/audiogen_demo/', **kwargs)

with socketserver.TCPServer(("", PORT), handler) as httpd:
    # print(f"Serving on port {PORT}")
    httpd.serve_forever()
