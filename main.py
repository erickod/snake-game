from concurrent.futures import ProcessPoolExecutor
from pyngrok import ngrok


print(ngrok.connect(8080, proto='http'))