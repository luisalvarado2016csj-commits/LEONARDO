import h5py
import json

def fix_dict(obj):
    modificado = False
    if isinstance(obj, dict):
        if 'quantization_config' in obj:
            print(f"Borrando quantization_config de {obj.get('name', 'unknown')}")
            del obj['quantization_config']
            modificado = True
            
        if 'dtype' in obj and isinstance(obj['dtype'], dict) and obj['dtype'].get('class_name') == 'DTypePolicy':
            obj['dtype'] = obj['dtype']['config']['name']
            modificado = True
        
        # Recursively check other keys
        for k, v in obj.items():
            if fix_dict(v):
                modificado = True
                
    elif isinstance(obj, list):
        for item in obj:
            if fix_dict(item):
                modificado = True
    return modificado

try:
    print("Abriendo archivo .h5...")
    f = h5py.File('backend/ModeloPredictivo.h5', 'r+')
    model_config_str = f.attrs.get('model_config')
    
    if model_config_str is None:
        print("No se encontró model_config en el archivo.")
    else:
        if isinstance(model_config_str, bytes):
            model_config_str = model_config_str.decode('utf-8')
            
        model_config = json.loads(model_config_str)
        modificado = fix_dict(model_config)
                    
        if modificado:
            nuevo_config_str = json.dumps(model_config).encode('utf-8')
            f.attrs['model_config'] = nuevo_config_str
            print("El modelo ha sido parcheado correctamente.")
        else:
            print("No se encontraron cambios que aplicar.")
            
    f.close()
except Exception as e:
    print(f"Error: {e}")
