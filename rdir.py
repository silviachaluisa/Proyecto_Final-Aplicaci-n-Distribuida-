import os
import sys

def listar_directorio(ruta, prefijo='', exclude_paths=set()):
    """
    Lista el directorio en formato de árbol, excluyendo rutas especificadas.
    """
    try:
        elementos = sorted(os.listdir(ruta))
    except PermissionError:
        print(prefijo + "└── [Acceso denegado]")
        return
    
    elementos_filtrados = [e for e in elementos if e not in exclude_paths]
    cantidad = len(elementos_filtrados)
    
    for i, elemento in enumerate(elementos_filtrados):
        ruta_elemento = os.path.join(ruta, elemento)
        es_ultimo = (i == cantidad - 1)
        conector = '└── ' if es_ultimo else '├── '
        nuevo_prefijo = prefijo + ('    ' if es_ultimo else '│   ')
        
        print(prefijo + conector + elemento)
        
        if os.path.isdir(ruta_elemento):
            listar_directorio(ruta_elemento, nuevo_prefijo, exclude_paths)

if __name__ == '__main__':
    ruta_inicial = '.'
    exclude_paths = set()
    
    try:
        if '-p' in sys.argv:
            ruta_inicial = sys.argv[sys.argv.index('-p') + 1]
        if '-x' in sys.argv:
            x_index = sys.argv.index('-x') + 1
            exclude_paths = set(sys.argv[x_index:])  # Toma todos los valores después de -x
        
        print("exclude_paths ->", list(exclude_paths))
        print("ruta a listar ->", os.path.abspath(ruta_inicial))
        
        if not os.path.exists(ruta_inicial):
            print(f"La ruta '{ruta_inicial}' no existe.")
            sys.exit(1)
        
        listar_directorio(ruta_inicial, exclude_paths=exclude_paths)
    except Exception as e:
        print("Error:", e)
        sys.exit(1)
