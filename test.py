import requests
from collections import Counter
import tqdm
import time

# Lista para guardar los servidores que responden
respuestas = []

# Hacer 100 peticiones con barra de progreso
for _ in tqdm.tqdm(range(100)):
    # Hacer una petición GET a la URL
    response = requests.get("http://localhost:80/")
    
    # Obtener el valor del encabezado X-Served-By
    servidor = response.json()
    
    # Guardar el servidor en la lista de respuestas
    respuestas.append(f"servidor que respondio -> {servidor["servidor"]}")
    
    # Esperar 0.1 segundos antes de hacer la siguiente petición
    time.sleep(0.1)

# Contar cuántas veces responde cada servidor
conteo = Counter(respuestas)
suma = sum(conteo.values())

# Imprimir el conteo de respuestas por servidor
for servidor, cantidad in conteo.items():
    print(f"{servidor}: {cantidad}")

print(f"Total de respuestas: {suma}")
